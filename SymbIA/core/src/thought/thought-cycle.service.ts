import { injectable, inject } from 'tsyringe';
import type { Message, MessageRole, LlmSetConfig } from '@symbia/interfaces';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';

@injectable()
export class ThoughtCycleService {
    constructor(
        @inject(LlmGateway) private llmGateway: LlmGateway,
        @inject(LlmSetService) private llmSetService: LlmSetService
    ) { }

    async handle(_userId: string, memoryId: string, message: string, llmSetId?: string): Promise<string> {
        // Get LLM set configuration
        const llmSetConfig = await this.getLlmSetForChat(llmSetId);
        if (!llmSetConfig) {
            throw new Error('No suitable LLM set found for chat');
        }

        // Mock: recupera últimas 10 mensagens em SQL (para este primeiro ciclo sem planner)
        const recentMessages = await this.getRecentMessages(memoryId);

        // Constrói o contexto para enviar ao LLM
        const contextMessages = this.buildContextMessages(recentMessages, message);

        // Envia ao LLM usando fast-chat
        const response = await this.llmGateway.invoke(llmSetConfig, 'chat', contextMessages);

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
                createdAt: new Date(Date.now() - 3600000), // 1 hora atrás
                'chat-history': true,
                modal: 'text'
            },
            {
                id: 'msg-2',
                chatId: 'chat-1',
                role: 'assistant' as MessageRole,
                content: 'Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?',
                contentType: 'text',
                createdAt: new Date(Date.now() - 3500000), // 58 minutos atrás
                'chat-history': true,
                modal: 'text'
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

    /**
     * Get LLM set configuration for chat with fallback logic
     */
    private async getLlmSetForChat(llmSetId?: string): Promise<LlmSetConfig | null> {
        // If a specific LLM set ID is provided, try to get it first
        if (llmSetId) {
            const requestedSet = await this.llmSetService.getLlmSetById(llmSetId);
            if (requestedSet && (requestedSet.models.chat || requestedSet.models.reasoning)) {
                return requestedSet;
            }
        }

        // Fallback logic - try to find a suitable LLM set with chat support
        const allSets = await this.llmSetService.loadLlmSets();
        return allSets.find(set => set.models.chat || set.models.reasoning) || null;
    }
}
