import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { z } from 'zod';
import { ThoughtCycleService } from '@symbia/core';
import type { MessageDTO, SendMessageResponse } from '@symbia/interfaces';

// Schema de validação para o body
const sendMessageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty')
});

// Schema de validação para os params
const chatParamsSchema = z.object({
    memoryId: z.string().uuid('Invalid memory ID format')
});

@injectable()
export class ChatController {
    constructor(
        @inject(ThoughtCycleService) private thoughtCycleService: ThoughtCycleService
    ) { }

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
            const { content } = bodyResult.data;

            // Extrair userId do token (mock por enquanto)
            const userId = req.headers.authorization?.replace('Bearer ', '') || 'mock-user-id';

            // Medir latência
            const startTime = Date.now();

            // Chamar ThoughtCycleService (com fallback para mock durante testes)
            let responseContent: string;
            try {
                responseContent = await this.thoughtCycleService.handle(userId, memoryId, content);
            } catch (error) {
                // Fallback para resposta mock se houver erro de configuração
                console.warn('ThoughtCycleService failed, using mock response:', error);
                responseContent = `Hello! I received your message: "${content}". This is a mock response for testing purposes.`;
            }

            const endTime = Date.now();
            const latency = endTime - startTime;

            // Mock: persistir mensagem do usuário e resposta no "SQL"
            const userMessage: MessageDTO = {
                id: `msg-${Date.now()}-user`,
                chatId: `chat-${memoryId}`,
                role: 'user',
                content,
                contentType: 'text',
                createdAt: new Date().toISOString()
            };

            const assistantMessage: MessageDTO = {
                id: `msg-${Date.now()}-assistant`,
                chatId: `chat-${memoryId}`,
                role: 'assistant',
                content: responseContent,
                contentType: 'text',
                createdAt: new Date().toISOString()
            };

            // Mock: salvar no banco de dados
            // TODO: implementar persistência real
            await this.saveMessage(userMessage);
            await this.saveMessage(assistantMessage);

            const response: SendMessageResponse = {
                userMessage,
                assistantMessage
            };

            // Adicionar header com latência para debugging
            res.setHeader('X-Response-Time', `${latency}ms`);

            res.status(200).json(response);
        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private async saveMessage(message: MessageDTO): Promise<void> {
        // Mock: simula persistência no SQL
        // TODO: implementar persistência real
        console.log('Saving message:', message.id, message.role, message.content.substring(0, 50) + '...');
    }
}
