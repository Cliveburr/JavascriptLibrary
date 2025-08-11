import type { Request, Response } from 'express';
import { ThoughtCycleService, ChatService, LlmSetService, ChatStreamMessage } from '@symbia/core';
import { ChatContext } from '../helpers/chat-context';
import { chatValidation } from '../helpers/chat-validation';

export class ChatController {

    public constructor(
        private thoughtCycleService: ThoughtCycleService,
        private chatService: ChatService,
        private llmSetService: LlmSetService
    ) {
    }

    async getChatsByMemory(req: Request, res: Response): Promise<void> {
        try {
            const { memoryId } = req.query;

            if (!memoryId || typeof memoryId !== 'string') {
                res.status(400).json({ error: 'MemoryId é obrigatório' });
                return;
            }

            const chats = await this.chatService.getChatsByMemory(memoryId);

            // Converter para DTO
            const chatDTOs = chats.map(chat => ({
                chatId: chat._id.toString(),
                memoryId: chat.memoryId.toString(),
                title: chat.title,
                orderIndex: chat.orderIndex
            }));

            res.json(chatDTOs);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).json({ error: 'Erro ao buscar chats' });
        }
    }

    async getMessagesByChat(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                res.status(400).json({ error: 'ChatId é obrigatório' });
                return;
            }

            const messages = await this.chatService.getMessagesByChat(chatId);

            const messageDTOs = messages.map<ChatStreamMessage>(message => ({
                messageId: message._id.toString(),
                role: message.role,
                content: message.content,
                modal: message.modal
            }));

            res.json(messageDTOs);
        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'Erro ao buscar mensagens' });
        }
    }

    async deleteChat(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;

            if (!chatId) {
                res.status(400).json({ error: 'ChatId é obrigatório' });
                return;
            }

            const deleted = await this.chatService.deleteChat(chatId);

            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Chat não encontrado' });
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            res.status(500).json({ error: 'Erro ao deletar chat' });
        }
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
        const data = await chatValidation.validate(this.chatService, this.llmSetService, req);
        if (chatValidation.isError(data)) {
            ChatContext.sendStaticError(res, data);
            return;
        }

        try {
            const ctx = new ChatContext(this.chatService, data, res);

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            const paralelTasks: Array<Promise<any>> = [
                this.thoughtCycleService.handle(ctx)
            ];

            if (ctx.data.isNewChat) {
                paralelTasks.push(this.generateAndUpdateChatTitle(ctx));
            }

            await Promise.all(paralelTasks);
            await ctx.sendCompleted();
        } catch (error) {
            ChatContext.sendStaticError(res, {
                isError: true,
                code: 500,
                message: 'Internal Error',
                error
            });
        }
    }

    async generateAndUpdateChatTitle(ctx: ChatContext): Promise<void> {
        try {
            if (!ctx.data.chatId) {
                throw 'Invalid stream.chatId';
            }

            const generatedTitle = await this.chatService.generateChatTitle(ctx.data.userMessage, ctx.data.llmSetConfig,
                ctx.sendStreamTitle.bind(ctx)
            );
            await this.chatService.updateChatTitle(ctx.data.chatId, generatedTitle);

        } catch (error) {
            console.warn('Error generating chat title:', error);
            // Continua mesmo se falhar a geração do título
        }
    }

    async updateChatTitle(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            const { title } = req.body;

            if (!chatId || !title || typeof title !== 'string' || title.length > 60) {
                res.status(400).json({ error: 'ChatId e título válido são obrigatórios (máx. 60 caracteres)' });
                return;
            }

            const updatedChat = await this.chatService.updateChatTitle(chatId, title);

            if (updatedChat) {
                const chatDTO = {
                    id: updatedChat._id.toString(),
                    memoryId: updatedChat.memoryId.toString(),
                    title: updatedChat.title,
                    orderIndex: updatedChat.orderIndex,
                    createdAt: updatedChat.createdAt.toISOString(),
                    updatedAt: updatedChat.updatedAt?.toISOString()
                };
                res.json(chatDTO);
            } else {
                res.status(404).json({ error: 'Chat não encontrado' });
            }
        } catch (error) {
            console.error('Error updating chat title:', error);
            res.status(500).json({ error: 'Erro ao atualizar título do chat' });
        }
    }

    // Endpoint para reordenar chats
    async updateChatOrder(req: Request, res: Response): Promise<void> {
        try {
            const { chatId } = req.params;
            const { orderIndex } = req.body;

            if (!chatId || typeof orderIndex !== 'number' || orderIndex < 0) {
                res.status(400).json({ error: 'ChatId e orderIndex válido (>= 0) são obrigatórios' });
                return;
            }

            const updatedChat = await this.chatService.updateChatOrder(chatId, orderIndex);

            if (updatedChat) {
                const chatDTO = {
                    id: updatedChat._id.toString(),
                    memoryId: updatedChat.memoryId.toString(),
                    title: updatedChat.title,
                    orderIndex: updatedChat.orderIndex,
                    createdAt: updatedChat.createdAt.toISOString(),
                    updatedAt: updatedChat.updatedAt?.toISOString()
                };
                res.json(chatDTO);
            } else {
                res.status(404).json({ error: 'Chat não encontrado' });
            }
        } catch (error) {
            console.error('Error updating chat order:', error);
            res.status(500).json({ error: 'Erro ao reordenar chat' });
        }
    }
}
