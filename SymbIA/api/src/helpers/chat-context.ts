import type { Request, Response } from 'express';
import type { Chat, ChatService, LlmSetService } from '@symbia/core';
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
    orderIndex?: number;
    chat?: Chat;
    isNewChat: boolean = false;
    llmSetConfig!: LlmSetConfig;
    messages!: Message[];
    finalizeIteration: boolean = false;

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
            this.orderIndex = chat.orderIndex;
            this.messages = await this.chatService.getMessagesByChat(this.chatId);
        } else {
            this.isNewChat = true;
            const newChat = await this.chatService.createChat(this.userId, this.memoryId, 'Novo Chat');
            this.orderIndex = newChat.orderIndex;
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

    async sendInitMessage(): Promise<void> {
        if (!this.chatId || !this.orderIndex) {
            throw 'Invalid chatId, missing validateChat';
        }

        const userMessage = await this.saveMessageBy('user', this.content, 'text');

        if (this.isNewChat) {
            await this.sendMessage({
                type: MessageType.InitNewStream,
                chatId: this.chatId,
                orderIndex: this.orderIndex,
                userMessage: {
                    id: userMessage._id.toString(),
                    modal: userMessage.modal,
                    role: userMessage.role,
                    content: userMessage.content
                }
            });
        }
        else {
            await this.sendMessage({
                type: MessageType.InitStream,
                userMessage: {
                    id: userMessage._id.toString(),
                    modal: userMessage.modal,
                    role: userMessage.role,
                    content: userMessage.content
                }
            });
        }
    }

    async sendCompleted(): Promise<void> {
        await this.sendMessage({
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

    async sendStreamTitleMessage(content: string): Promise<void> {
        await this.sendMessage({
            type: MessageType.StreamTitle,
            content
        });
    }

    async sendThinking(): Promise<void> {
        await this.sendMessage({
            type: MessageType.Thinking
        });
    }

    async sendPrepareStreamTextMessage(role: MessageRole, modal: MessageModal): Promise<Message> {
        await this.sendMessage({
            type: MessageType.PrepareStreamText,
            role,
            modal
        });
        return {
            _id: new ObjectId(),
            chatId: new ObjectId(this.chatId),
            role,
            modal,
            content: '',
            createdAt: new Date()
        };
    }

    async sendStreamTextMessage(content: string): Promise<void> {
        await this.sendMessage({
            type: MessageType.StreamText,
            content
        });
    }

    async sendCompleteStreamTextMessage(message: Message, fullContent: string): Promise<void> {
        message.content = fullContent;
        const savedMessage = await this.saveMessage(message);
        await this.sendMessage({
            type: MessageType.CompleteStreamText,
            id: savedMessage._id.toString()
        });
    }

    private async saveMessage(message: Message): Promise<Message> {
        const savedMessage = await this.chatService.saveMessage(message);
        this.messages.push(savedMessage);
        return savedMessage;
    }

    private saveMessageBy(role: MessageRole, content: string, modal: MessageModal): Promise<Message> {
        return this.saveMessage({
            _id: new ObjectId(),
            chatId: new ObjectId(this.chatId),
            role,
            content,
            createdAt: new Date(),
            modal
        });
    }

    private sendMessage(message: MessageFormat): Promise<void> {
        return new Promise((resolve, reject) => {
            this.res.write(JSON.stringify(message) + '\n', 'utf8', (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}