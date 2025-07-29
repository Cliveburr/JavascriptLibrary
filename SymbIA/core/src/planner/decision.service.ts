import { injectable, inject } from 'tsyringe';
import type { Message } from '@symbia/interfaces';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';
import { getEnabledActionNames } from '../actions/action.registry.js';
import { MongoDBService } from '../database/mongodb.service.js';

export class DecisionServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DecisionServiceError';
    }
}

@injectable()
export class DecisionService {
    constructor(
        @inject(LlmGateway) private llmGateway: LlmGateway,
        @inject(LlmSetService) private llmSetService: LlmSetService,
        @inject(MongoDBService) private mongodbService: MongoDBService
    ) {
        // Ensure MongoDB connection
        this.mongodbService.connect().catch(console.error);
    }

    /**
     * Decide which action to take based on the conversation context
     * @param userId The user ID
     * @param memoryId The memory ID
     * @param chatId The chat ID
     * @param message The user's message
     * @returns The name of the action to execute
     */
    async decide(userId: string, memoryId: string, chatId: string, message: string): Promise<string> {
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

        try {
            // Get chat history with chat-history flag
            const chatHistory = await this.getChatHistory(chatId);

            // Get available actions
            const enabledActions = getEnabledActionNames();

            if (enabledActions.length === 0) {
                throw new DecisionServiceError('No actions are available');
            }

            // Build the decision prompt
            const prompt = this.buildDecisionPrompt(message, chatHistory, enabledActions);

            // Get reasoning-heavy LLM set with fallback
            const llmSet = await this.getLlmSetWithFallback();

            // Call LLM to get decision
            const response = await this.llmGateway.invoke(
                llmSet,
                [{ role: 'user', content: prompt }],
                {
                    temperature: 0.1, // Low temperature for consistent decisions
                    maxTokens: 50 // Short response expected
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
        const db = await this.mongodbService.getDatabase();
        const collection = db.collection<Message>('messages');

        // Get messages for this chat
        // Note: We'll assume there's a chatHistory field or similar mechanism
        // For now, we'll get the recent messages (last 20)
        const messages = await collection
            .find({ chatId })
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        return messages.reverse(); // Return in chronological order
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
     * Get reasoning-heavy LLM set with fallback to reasoning
     */
    private async getLlmSetWithFallback(): Promise<any> {
        // Try to get reasoning-heavy set first
        let llmSet = await this.llmSetService.getLlmSetById('reasoning-heavy');

        if (!llmSet || !llmSet.models.reasoningHeavy) {
            // Fallback to reasoning set
            llmSet = await this.llmSetService.getLlmSetById('reasoning');

            if (!llmSet || !llmSet.models.reasoning) {
                throw new DecisionServiceError('No suitable LLM set found (reasoning-heavy or reasoning)');
            }
        }

        return llmSet;
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
