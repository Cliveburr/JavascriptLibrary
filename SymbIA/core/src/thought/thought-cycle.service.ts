import type { Message, LlmSetConfig, StreamProgressCallback } from '@symbia/interfaces';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';
import { ChatService } from '../chat/chat.service.js';

export class ThoughtCycleService {
    constructor(
        private llmGateway: LlmGateway,
        private llmSetService: LlmSetService,
        private chatService: ChatService
    ) { }

    async handle(
        _userId: string,
        memoryId: string,
        message: string,
        llmSetId: string,
        chatId: string,
        streamCallback: StreamProgressCallback
    ): Promise<string> {

        // Get LLM set configuration
        const llmSetConfig = await this.getLlmSetForChat(llmSetId);
        if (!llmSetConfig) {
            throw new Error(`LLM set '${llmSetId}' not found or doesn't support chat`);
        }

        // Recupera últimas mensagens do banco usando memoryId
        const recentMessages = await this.getRecentMessages(memoryId);

        // Constrói o contexto para enviar ao LLM
        const contextMessages = this.buildContextMessages(recentMessages, message);

        const response = await this.llmGateway.invokeAsync(llmSetConfig, 'chat', contextMessages, streamCallback);

        // Salva a mensagem do assistente no banco
        const assistantMessage = {
            id: `msg-${Date.now()}-assistant`,
            chatId: chatId,
            role: 'assistant' as const,
            content: response.content,
            contentType: 'text' as const,
            toolCall: undefined,
            createdAt: new Date(),
            'chat-history': true,
            modal: 'text' as const
        };

        await this.chatService.saveMessage(assistantMessage);

        return response.content;
    }

    private async getRecentMessages(memoryId: string): Promise<Message[]> {
        if (!memoryId?.trim()) {
            throw new Error('Memory ID is required to fetch recent messages');
        }

        // Buscar todos os chats da memória
        const chats = await this.chatService.getChatsByMemory(memoryId);

        if (chats.length === 0) {
            return [];
        }

        // Buscar mensagens dos últimos 3 chats (com flag chat-history = true)
        const recentChats = chats.slice(-3);
        const allMessages: Message[] = [];

        for (const chat of recentChats) {
            const messages = await this.chatService.getMessagesByChat(chat.id);
            // Filtrar apenas mensagens com chat-history = true
            const historyMessages = messages.filter(msg => msg['chat-history'] === true);
            allMessages.push(...historyMessages);
        }

        // Ordenar por data de criação e pegar as últimas 10
        const sortedMessages = allMessages
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
            .slice(-10);

        return sortedMessages;
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
     * Get LLM set configuration for chat - no fallback, must be exact match
     */
    private async getLlmSetForChat(llmSetId: string): Promise<LlmSetConfig | null> {
        const requestedSet = await this.llmSetService.getLlmSetById(llmSetId);
        if (!requestedSet) {
            return null;
        }

        // Verify the LLM set has chat capabilities
        if (!requestedSet.models.chat && !requestedSet.models.reasoning) {
            return null;
        }

        return requestedSet;
    }
}
