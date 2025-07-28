import { injectable, inject } from 'tsyringe';
import type { Message, MessageRole } from '@symbia/interfaces';
import { LlmGateway } from '../llm/LlmGateway.js';

@injectable()
export class ThoughtCycleService {
    constructor(
        @inject(LlmGateway) private llmGateway: LlmGateway
    ) { }

    async handle(_userId: string, memoryId: string, message: string): Promise<string> {
        // Mock: recupera últimas 10 mensagens em SQL (para este primeiro ciclo sem planner)
        const recentMessages = await this.getRecentMessages(memoryId);

        // Constrói o contexto para enviar ao LLM
        const contextMessages = this.buildContextMessages(recentMessages, message);

        // Envia ao LLM usando fast-chat
        const response = await this.llmGateway.invoke('fast-chat', contextMessages);

        return response.content;
    }

    private async getRecentMessages(_memoryId: string): Promise<Message[]> {
        // Mock: simula recuperação das últimas 10 mensagens do SQL
        // TODO: implementar recuperação real do banco de dados
        return [
            {
                id: 'msg-1',
                chatId: 'chat-1',
                role: 'user' as MessageRole,
                content: 'Olá, como você está?',
                contentType: 'text',
                createdAt: new Date(Date.now() - 3600000) // 1 hora atrás
            },
            {
                id: 'msg-2',
                chatId: 'chat-1',
                role: 'assistant' as MessageRole,
                content: 'Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?',
                contentType: 'text',
                createdAt: new Date(Date.now() - 3500000) // 58 minutos atrás
            }
        ];
    }

    private buildContextMessages(recentMessages: Message[], newMessage: string) {
        const messages = [];

        // Adiciona mensagens recentes como contexto
        for (const msg of recentMessages) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }

        // Adiciona a nova mensagem do usuário
        messages.push({
            role: 'user',
            content: newMessage
        });

        return messages;
    }
}
