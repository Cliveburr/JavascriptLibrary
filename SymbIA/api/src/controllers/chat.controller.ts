import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { z } from 'zod';
import { ThoughtCycleService, ChatService } from '@symbia/core';
import type { MessageProgress } from '@symbia/interfaces';
import { MessageProgressModal } from '@symbia/interfaces';

// Schema de validação para o body
const sendMessageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    chatId: z.string().optional(),
    llmSetId: z.string().min(1, 'LLM Set ID is required')
});

// Schema de validação para os params
const chatParamsSchema = z.object({
    memoryId: z.string().uuid('Invalid memory ID format')
});

@injectable()
export class ChatController {
    constructor(
        @inject(ThoughtCycleService) private thoughtCycleService: ThoughtCycleService,
        @inject(ChatService) private chatService: ChatService
    ) { }

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
                id: chat.id,
                memoryId: chat.memoryId,
                title: chat.title,
                orderIndex: chat.orderIndex,
                createdAt: chat.createdAt.toISOString(),
                updatedAt: chat.updatedAt?.toISOString()
            }));

            res.json(chatDTOs);
        } catch (error) {
            console.error('Error fetching chats:', error);
            res.status(500).json({ error: 'Erro ao buscar chats' });
        }
    }

    async createChat(req: Request, res: Response): Promise<void> {
        try {
            const { memoryId, title } = req.body;

            if (!memoryId) {
                res.status(400).json({ error: 'MemoryId é obrigatório' });
                return;
            }

            const newChat = await this.chatService.createChat(memoryId, title || 'Novo Chat');

            // Converter para DTO
            const chatDTO = {
                id: newChat.id,
                memoryId: newChat.memoryId,
                title: newChat.title,
                orderIndex: newChat.orderIndex,
                createdAt: newChat.createdAt.toISOString(),
                updatedAt: newChat.updatedAt?.toISOString()
            };

            res.status(201).json(chatDTO);
        } catch (error) {
            console.error('Error creating chat:', error);
            res.status(500).json({ error: 'Erro ao criar chat' });
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

            // Converter para DTO
            const messageDTOs = messages.map(message => ({
                id: message.id,
                chatId: message.chatId,
                role: message.role,
                content: message.content,
                contentType: message.contentType,
                createdAt: message.createdAt.toISOString()
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
        try {
            // Validar params
            const paramsResult = chatParamsSchema.safeParse(req.params);
            if (!paramsResult.success) {
                res.status(400).json({
                    error: 'Invalid parameters',
                    details: paramsResult.error.errors
                });
                return;
            }

            // Validar body
            const bodyResult = sendMessageSchema.safeParse(req.body);
            if (!bodyResult.success) {
                res.status(400).json({
                    error: 'Invalid request body',
                    details: bodyResult.error.errors
                });
                return;
            }

            const { memoryId } = paramsResult.data;
            const { content, chatId, llmSetId } = bodyResult.data;

            // Extrair userId do request (precisa do middleware de auth)
            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;

            let finalChatId = chatId;
            let isNewChat = false;

            // Fazer checagem se é chat novo ou se já existe
            if (chatId) {
                const chat = await this.chatService.getChatById(chatId);
                if (!chat) {
                    res.status(404).json({ error: 'Chat não encontrado' });
                    return;
                }
                console.log('New iteration on chatId: ' + chatId);
            } else {
                // Se não tem chatId, é um chat novo - criar temporariamente com título padrão
                isNewChat = true;
                const newChat = await this.chatService.createChat(memoryId, 'Novo Chat');
                finalChatId = newChat.id;
                console.log('New chat created: ' + finalChatId);
            }

            // Setup streaming headers
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            if (!finalChatId) {
                res.status(500).json({ error: 'Failed to create or validate chat' });
                return;
            }

            // Criar e salvar mensagem do usuário no banco imediatamente
            const userMessage = {
                id: `msg-${Date.now()}-user`,
                chatId: finalChatId,
                role: 'user' as const,
                content,
                contentType: 'text' as const,
                toolCall: undefined,
                createdAt: new Date(),
                'chat-history': true,
                modal: 'text' as const
            };

            await this.chatService.saveMessage(userMessage);

            // Medir latência
            const startTime = Date.now();

            // Stream callback function (obrigatório)
            const streamCallback = async (progress: MessageProgress) => {
                console.log('Sending message progress of type ' + progress.modal);
                res.write(JSON.stringify(progress) + '\n');
            };

            const userMessageProgress: MessageProgress = {
                modal: MessageProgressModal.Text,
                data: {
                    userMessage: {
                        id: userMessage.id,
                        chatId: userMessage.chatId,
                        role: userMessage.role,
                        content: userMessage.content,
                        contentType: userMessage.contentType,
                        createdAt: userMessage.createdAt.toISOString()
                    }
                }
            };
            streamCallback(userMessageProgress);

            // Chamar ThoughtCycleService.handle SEMPRE passando streamCallback (não é opcional)
            // Esta função não tem retorno específico, mas retorna o conteúdo da resposta
            await this.thoughtCycleService.handle(
                userId,
                memoryId,
                content,
                llmSetId,
                finalChatId,
                streamCallback
            );

            const endTime = Date.now();
            const latency = endTime - startTime;

            // Se é um chat novo, gerar título automaticamente após o thoughtCycle
            if (isNewChat && finalChatId) {
                try {
                    const generatedTitle = await this.chatService.generateChatTitle(content, llmSetId);
                    await this.chatService.updateChatTitle(finalChatId, generatedTitle);

                    // Enviar atualização do título
                    const titleProgress: MessageProgress = {
                        modal: MessageProgressModal.UpdateTitle,
                        data: { chatId: finalChatId, title: generatedTitle }
                    };
                    streamCallback(titleProgress);
                } catch (error) {
                    console.warn('Error generating chat title:', error);
                    // Continua mesmo se falhar a geração do título
                }
            }

            // Enviar mensagem de conclusão
            const completionProgress: MessageProgress = {
                modal: MessageProgressModal.Info,
                data: {
                    message: 'Completed',
                    latency: `${latency}ms`
                }
            };
            streamCallback(completionProgress);

            // Finalizar o stream
            res.end();
        } catch (error) {
            console.error('Error in sendMessage:', error);

            // Tentar enviar erro através do stream se os headers ainda não foram enviados
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Internal server error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            } else {
                // Se estamos em modo streaming, enviar erro como progress
                const errorProgress: MessageProgress = {
                    modal: MessageProgressModal.Error,
                    data: {
                        message: error instanceof Error ? error.message : 'Unknown error'
                    }
                };
                res.write(JSON.stringify(errorProgress) + '\n');
                res.end();
            }
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
                    id: updatedChat.id,
                    memoryId: updatedChat.memoryId,
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
                    id: updatedChat.id,
                    memoryId: updatedChat.memoryId,
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
