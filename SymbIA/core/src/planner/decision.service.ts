import type { Message } from '@symbia/interfaces';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';
import { getEnabledActionNames } from '../actions/action.registry.js';
import { ChatService } from '../chat/chat.service.js';

export class DecisionServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DecisionServiceError';
    }
}

export class DecisionService {
    constructor(
        private llmSetService: LlmSetService,
        private llmGateway: LlmGateway,
        private chatService: ChatService
    ) { }

    /**
     * Decide which action to take based on the conversation context
     * @param userId The user ID
     * @param memoryId The memory ID
     * @param chatId The chat ID
     * @param message The user's message
     * @param llmSetId The ID of the LLM set to use for decision making
     * @returns The name of the action to execute
     */
    async decide(userId: string, memoryId: string, chatId: string, message: string, llmSetId: string): Promise<string> {
        if (!userId?.trim()) {
            throw new DecisionServiceError('User ID is required');
        }

        if (!memoryId?.trim()) {
            throw new DecisionServiceError('Memory ID is required');
        }

        if (!chatId?.trim()) {
            throw new DecisionServiceError('Chat ID is required');
        }

        if (!message?.trim()) {
            throw new DecisionServiceError('Message is required');
        }

        if (!llmSetId?.trim()) {
            throw new DecisionServiceError('LLM Set ID is required');
        }

        try {
            // Get the specific LLM set - no fallback
            const llmSet = await this.llmSetService.getLlmSetById(llmSetId);
            if (!llmSet || (!llmSet.models.reasoningHeavy && !llmSet.models.reasoning)) {
                throw new DecisionServiceError(`LLM set '${llmSetId}' not found or doesn't support reasoning`);
            }

            // Get chat history with chat-history flag
            const chatHistory = await this.getChatHistory(chatId);

            // Get available actions
            const enabledActions = getEnabledActionNames();

            if (enabledActions.length === 0) {
                throw new DecisionServiceError('No actions are available');
            }

            // Build the decision prompt
            const prompt = this.buildDecisionPrompt(message, chatHistory, enabledActions);

            // Get the model to use (reasoningHeavy or reasoning)
            const modelToUse = llmSet.models.reasoningHeavy || llmSet.models.reasoning;
            if (!modelToUse) {
                throw new DecisionServiceError('No reasoning model found in LLM set');
            }

            // Call LLM to get decision using the LLM set configuration
            const response = await this.llmGateway.invoke(
                llmSet,
                'reasoningHeavy', // Try reasoningHeavy first, will fallback to reasoning
                [{ role: 'user', content: prompt }],
                {
                    temperature: 0.1, // Low temperature for consistent decisions
                    maxTokens: 50, // Short response expected
                }
            );

            // Extract action name from response
            const actionName = this.extractActionName(response.content, enabledActions);

            return actionName;
        } catch (error) {
            if (error instanceof DecisionServiceError) {
                throw error;
            }
            throw new DecisionServiceError(`Failed to make decision: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get chat history messages marked with chat-history flag
     */
    private async getChatHistory(chatId: string): Promise<Message[]> {
        if (!chatId?.trim()) {
            throw new DecisionServiceError('Chat ID is required to fetch chat history');
        }

        try {
            // Get messages for this chat
            const messages = await this.chatService.getMessagesByChat(chatId);

            // Filter only messages with chat-history = true and get last 20
            const historyMessages = messages
                .filter(msg => msg['chat-history'] === true)
                .slice(-20);

            return historyMessages;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw new DecisionServiceError(`Failed to fetch chat history: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Build the decision prompt with context
     */
    private buildDecisionPrompt(userMessage: string, chatHistory: Message[], enabledActions: string[]): string {
        let prompt = `You are an AI assistant that must decide which action to take next. Based on the conversation history and the user's current message, respond with ONLY the exact name of one action from the available actions list.

Current user message: "${userMessage}"

Chat History:
`;

        // Add chat history context
        chatHistory.forEach(msg => {
            prompt += `${msg.role}: ${msg.content}\n`;
        });

        prompt += `
Available Actions (respond with EXACT name only):
${enabledActions.map(action => `- ${action}`).join('\n')}

Instructions:
- Respond with ONLY the action name, nothing else
- Choose the most appropriate action based on the context
- If no specific action is needed, choose "Finalize"

Action:`;

        return prompt;
    }

    /**
     * Extract action name from LLM response
     */
    private extractActionName(response: string, enabledActions: string[]): string {
        if (!response?.trim()) {
            throw new DecisionServiceError('Empty response from LLM');
        }

        const cleanedResponse = response.trim();

        // Try to find exact match first
        for (const action of enabledActions) {
            if (cleanedResponse.toLowerCase() === action.toLowerCase()) {
                return action;
            }
        }

        // Try to find action name within the response
        for (const action of enabledActions) {
            if (cleanedResponse.toLowerCase().includes(action.toLowerCase())) {
                return action;
            }
        }

        // If no match found, default to first available action or throw error
        if (enabledActions.includes('Finalize')) {
            return 'Finalize';
        }

        throw new DecisionServiceError(`Unable to extract valid action from response: "${cleanedResponse}". Available actions: ${enabledActions.join(', ')}`);
    }
}
