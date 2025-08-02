import type { Request, Response } from 'express';
import type { ChatService, LlmSetService } from '@symbia/core';
import type { MessageModal, MessageFormat, MessageRole, IChatContext, LlmSetConfig, Message } from '@symbia/core';
import { MessageType } from '@symbia/core';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

// Schema de validação para o body
const sendMessageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    chatId: z.string().optional(),
    llmSetId: z.string().min(1, 'LLM Set ID is required')
});

// Schema de validação para os params
const chatParamsSchema = z.object({
    memoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid memory ID format')
});

export class ChatContext implements IChatContext {

    memoryId!: string;
    llmSetIdStr?: string;
    userId!: string;
    content!: string;
    chatId?: string;
    isNewChat: boolean = false;
    llmSetConfig!: LlmSetConfig;
    messages!: Message[];

    constructor(
        private chatService: ChatService,
        private req: Request,
        private res: Response
    ) {
    }

    validateParams(): boolean {
        const paramsResult = chatParamsSchema.safeParse(this.req.params);
        if (!paramsResult.success) {
            this.sendError(400, 'Invalid parameters', paramsResult.error.errors);
            return false;
        }
        const { memoryId } = paramsResult.data;
        this.memoryId = memoryId;
        return true;
    }

    validateBody(): boolean {
        const bodyResult = sendMessageSchema.safeParse(this.req.body);
        if (!bodyResult.success) {
            this.sendError(400, 'Invalid request body', bodyResult.error.errors);
            return false;
        }
        const { content, chatId, llmSetId } = bodyResult.data;
        this.content = content;
        this.chatId = chatId;
        this.llmSetIdStr = llmSetId;
        return true;
    }

    validateAuthenticated(): boolean {
        // Extrair userId do request (precisa do middleware de auth)
        if (!this.req.user?.id) {
            this.sendError(401, 'User not authenticated');
            return false;
        }
        this.userId = this.req.user.id;
        return true;
    }

    async validateChat(): Promise<boolean> {
        if (this.chatId) {
            const chat = await this.chatService.getChatById(this.chatId);
            if (!chat) {
                this.sendError(404, 'Chat não encontrado');
                return false;
            }
            this.messages = await this.chatService.getMessagesByChat(this.chatId);
        } else {
            // Se não tem chatId, é um chat novo - criar temporariamente com título padrão
            this.isNewChat = true;
            const newChat = await this.chatService.createChat(this.userId, this.memoryId, 'Novo Chat');
            this.chatId = newChat._id.toString();
            this.messages = [];
        }
        return true;
    }

    async validateLlmSet(llmSetService: LlmSetService): Promise<boolean> {
        const llmSetConfig = await llmSetService.getLlmSetById(this.llmSetIdStr || '');
        if (!llmSetConfig) {
            this.sendError(404, `LLM set '${this.llmSetIdStr}' not found`);
            return false;
        }
        this.llmSetConfig = llmSetConfig;
        return true;
    }

    sendUserMessage(): Promise<void> {

        // Send message to be showed as user content
        this.sendMessage({
            type: MessageType.User,
            content: this.content,
            chatId: this.chatId
        });

        // Save in chat history
        return this.saveMessage('user', this.content, 'text');
    }

    sendCompleted(): void {
        this.sendMessage({
            type: MessageType.Completed
        });
        this.res.end();
    }

    sendError(code: number, message: string, error?: any): void {
        // If not error, means that is user error and not system
        if (error) {
            console.error(message, error); //TODO: maybe log in db, future error handler service
        }
        try {
            this.res.status(code).json(message);
        } catch { }
    }

    sendStreamTitleMessage(content: string): void {
        this.sendMessage({
            type: MessageType.StreamTitle,
            content
        });
    }

    sendThinking(): void {
        this.sendMessage({
            type: MessageType.Thinking
        });
    }

    sendStreamTextMessage(content: string): void {
        this.sendMessage({
            type: MessageType.StreamText,
            content: this.content
        });
    }

    async saveMessage(role: MessageRole, content: string, modal: MessageModal): Promise<void> {
        const message = await this.chatService.saveMessage({
            _id: new ObjectId(),
            chatId: new ObjectId(this.chatId),
            role,
            content,
            createdAt: new Date(),
            modal
        });
        this.messages.push(message);
    }

    private sendMessage(message: MessageFormat): void {
        this.res.write(JSON.stringify(message) + '\n');
    }
}