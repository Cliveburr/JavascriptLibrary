import type { Request, Response } from 'express';
import { ThoughtCycleService, ChatService, LlmSetService, ChatStreamMessage, ThoughtContext, AuthService, PromptForUseService, LlmGateway } from '@symbia/core';
import { chatValidation } from '../helpers/chat-validation';

export class ChatController {

    public constructor(
        private thoughtCycleService: ThoughtCycleService,
        private chatService: ChatService,
        private llmSetService: LlmSetService,
        private authService: AuthService,
        private promptForUseService: PromptForUseService,
        private llmGateway: LlmGateway
    ) { }

    async getChatsByMemory(req: Request, res: Response): Promise<void> {
        try {
            const { memoryId } = req.query;

            if (!memoryId || typeof memoryId !== 'string') {
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

            const chat = await this.chatService.getChatById(chatId);
            if (!chat) {
                res.status(404).json({ error: 'Chat não encontrado' });
                return;
            }
            const messageDTOs: ChatStreamMessage[] = [];
            for (const iteration of chat.iterations) {
                messageDTOs.push({ content: iteration.userMessage });
                for (const req of iteration.requests) {
                    if (req.llmResponse) {
                        messageDTOs.push({ content: req.llmResponse });
                    }
                }
            }
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
        const data = await chatValidation.validate(this.chatService, this.llmSetService, this.authService, this.promptForUseService, req);
        if (chatValidation.isError(data)) {
            res.status(data.code).json(data.message);
            return;
        }

        try {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            const ctx = new ThoughtContext(this.chatService, data, {
                status: (code: number, msg: any) => res.status(code).json(msg),
                end: () => res.end(),
                write: async (chunk: string) => new Promise<void>((resolve, reject) => {
                    res.write(chunk, 'utf8', err => err ? reject(err) : resolve());
                })
            });

            const parallelTasks: Array<Promise<any>> = [this.thoughtCycleService.handle(ctx)];

            if (ctx.data.isNewChat) {
                parallelTasks.push(this.generateAndUpdateChatTitle(ctx));
            }

            await Promise.all(parallelTasks);
            await ctx.sendCompleted();
        } catch (error) {
            res.status(500).json('Internal Error');
        }
    }

    async generateAndUpdateChatTitle(ctx: ThoughtContext): Promise<void> {
        try {
            const generatedTitle = await (async () => {
                const { generateChatTitle } = await import('@symbia/core/src/llm/requests/generateChatTitle');
                return generateChatTitle(this.llmGateway, ctx.data.user, ctx.data.userMessage, ctx.data.llmSetConfig, ctx.sendStreamTitle.bind(ctx));
            })();
            await this.chatService.updateChatTitle(ctx.data.chat._id.toString(), generatedTitle);
        } catch (error) {
            console.warn('Error generating chat title:', error);
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
