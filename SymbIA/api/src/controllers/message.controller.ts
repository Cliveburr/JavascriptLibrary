import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { z } from 'zod';
import { DecisionService, LlmGateway, MongoDBService } from '@symbia/core';
import { getActionByName } from '@symbia/core';
import type { ActionContext, Message } from '@symbia/interfaces';

// Schema de validação para o body
const sendMessageSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    llmSetId: z.string().min(1, 'LLM Set ID is required') // Required LLM set ID
});

// Schema de validação para os params
const messageParamsSchema = z.object({
    memoryId: z.string().uuid('Invalid memory ID format')
});

interface SendMessageResponse {
    placeholderId: string;
    status: 'thinking';
}

@injectable()
export class MessageController {
    constructor(
        @inject(DecisionService) private decisionService: DecisionService,
        @inject(LlmGateway) private llmGateway: LlmGateway,
        @inject(MongoDBService) private mongodbService: MongoDBService
    ) {
        // Ensure connections
        this.mongodbService.connect().catch(console.error);
    }

    async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            // Validar params
            const paramsResult = messageParamsSchema.safeParse(req.params);
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
            const { content, llmSetId } = bodyResult.data;

            // Extrair userId do token (mock por enquanto)
            const userId = req.headers.authorization?.replace('Bearer ', '') || 'mock-user-id';
            const chatId = `chat-${memoryId}`;

            // 1. Salvar mensagem do usuário no banco
            const userMessage: Message = {
                id: `msg-${Date.now()}-user`,
                chatId,
                role: 'user',
                content,
                contentType: 'text',
                createdAt: new Date(),
                "chat-history": true,
                "modal": "text"
            };
            await this.saveMessage(userMessage);

            // 2. Gerar placeholder id e retornar resposta imediata
            const placeholderId = `msg-${Date.now()}-placeholder`;

            const response: SendMessageResponse = {
                placeholderId,
                status: 'thinking'
            };

            // Retornar resposta imediata
            res.status(200).json(response);

            // 3. Processar thought cycle em background
            this.processThoughtCycle(userId, memoryId, chatId, content, placeholderId, llmSetId)
                .catch(error => {
                    console.error('Error in thought cycle:', error);
                    // Em caso de erro, enviar mensagem de erro ao usuário
                    this.sendErrorMessage(chatId, placeholderId).catch(console.error);
                });

        } catch (error) {
            console.error('Error in sendMessage:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    private async processThoughtCycle(
        userId: string,
        memoryId: string,
        chatId: string,
        userMessage: string,
        placeholderId: string,
        llmSetId: string
    ): Promise<void> {
        const sentMessages: Message[] = [];

        // Função helper para enviar mensagens
        const sendMessage = async (messageData: any): Promise<void> => {
            const message: Message = {
                id: messageData.id || `msg-${Date.now()}-${Math.random()}`,
                chatId,
                role: messageData.role || 'assistant',
                content: messageData.content,
                contentType: 'text',
                createdAt: new Date(),
                "chat-history": messageData["chat-history"] || false,
                "modal": messageData.modal || "text"
            };

            await this.saveMessage(message);
            sentMessages.push(message);

            // TODO: Implementar envio via WebSocket ou SSE para o frontend
            console.log('Sent message:', message.id, message.modal, message.content);
        };

        try {
            // 1. Enviar placeholder "Thinking..."
            await sendMessage({
                id: placeholderId,
                "chat-history": false,
                "modal": "text-for-replace",
                "role": "assistant",
                "content": "Thinking..."
            });

            // 2. Chamar DecisionService para decidir a próxima ação
            const actionName = await this.decisionService.decide(userId, memoryId, chatId, userMessage, llmSetId);

            // 3. Recuperar handler da ação via ActionRegistry
            const actionHandler = getActionByName(actionName);
            if (!actionHandler) {
                throw new Error(`Action handler not found for: ${actionName}`);
            }

            if (!actionHandler.enabled) {
                throw new Error(`Action is disabled: ${actionName}`);
            }

            // 4. Criar contexto para a ação
            const actionContext: ActionContext = {
                userId,
                memoryId,
                chatId,
                sendMessage,
                llm: this.llmGateway,
                mongo: this.mongodbService,
                vector: null, // Por enquanto sem Qdrant
                llmSetId // Pass the LLM set ID to actions
            };

            // 5. Executar a ação
            await actionHandler.execute(actionContext);

        } catch (error) {
            console.error('Error in thought cycle processing:', error);
            await this.sendErrorMessage(chatId, placeholderId);
        }
    }

    private async sendErrorMessage(chatId: string, placeholderId: string): Promise<void> {
        const errorMessage: Message = {
            id: placeholderId,
            chatId,
            role: 'assistant',
            content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
            contentType: 'text',
            createdAt: new Date(),
            "chat-history": false,
            "modal": "text"
        };

        await this.saveMessage(errorMessage);
    }

    private async saveMessage(message: Message): Promise<void> {
        try {
            // Mock: Por enquanto só fazemos log, sem persistir no banco
            // TODO: Descomentar quando MongoDB estiver disponível
            /*
            await this.mongodbService.connect();
            const db = await this.mongodbService.getDatabase();
            const collection = db.collection<Message>('messages');
            await collection.insertOne(message);
            */

            console.log('Saved message (MOCK):', message.id, message.role, message.content.substring(0, 50) + '...');
        } catch (error) {
            console.error('Error saving message:', error);
            throw error;
        }
    }
}
