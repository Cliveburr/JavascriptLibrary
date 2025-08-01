import type { IChatContext, LlmRequest, Message } from '../types/index.js';
import { LlmGateway } from '../llm/LlmGateway.js';
import type { ActionService } from '../actions/action.service';
import type { ActionHandler } from '../actions/act-defs';

export class DecisionService {
    constructor(
        private actionService: ActionService,
        private llmGateway: LlmGateway
    ) { }

    async decideNextAction(ctx: IChatContext): Promise<string> {

        // Get available actions
        const actions = this.actionService.getActions();
        if (actions.length === 0) {
            throw 'No actions are available';
        }

        // Build the decision prompt
        const messages = this.buildDecisionPrompt(ctx.messages, actions);

        // Call LLM to get decision using the LLM set configuration
        const response = await this.llmGateway.invoke(
            ctx.llmSetConfig.models.reasoningHeavy,
            messages,
            {
                temperature: 0.1, // Low temperature for consistent decisions
                maxTokens: 50, // Short response expected
            }
        );

        // Extract action name from response
        const actionName = this.extractActionName(response.content, actions);

        return actionName;
    }

    /**
     * Build the decision prompt with context
     */
    private buildDecisionPrompt(messages: Message[], actions: ActionHandler[]): LlmRequest["messages"] {
        const history = messages
            .map(msg => {
                return { role: msg.role, content: msg.content };
            });

        const systemPrompt = `You are an AI assistant that must decide which action to take next to anwser what user wants. Based on the conversation history and the user's current message, respond with ONLY the exact name of one action from the available actions list.

Available Actions (respond with EXACT name only):
${actions.map(a => `- ${a.name}, when to use: ${a.whenToUse}`).join('\n')}

Instructions:
- Respond with ONLY the action name, nothing else
- Choose the most appropriate action based on the context
- If no specific action is needed, choose "Finalize"

Action:`;

        return [
            ...history,
            { role: 'system', content: systemPrompt },
        ];
    }

    /**
     * Extract action name from LLM response
     */
    private extractActionName(response: string, actions: ActionHandler[]): string {
        if (!response?.trim()) {
            throw 'Empty response from LLM';
        }

        const cleanedResponse = response.trim();
        const actionNames = actions.map(a => a.name);

        // Try to find exact match first
        for (const action of actionNames) {
            if (cleanedResponse.toLowerCase() === action.toLowerCase()) {
                return action;
            }
        }

        // Try to find action name within the response
        for (const action of actionNames) {
            if (cleanedResponse.toLowerCase().includes(action.toLowerCase())) {
                return action;
            }
        }

        // If no match found, default to first available action or throw error
        if (actionNames.includes('Finalize')) {
            return 'Finalize';
        }

        throw `Unable to extract valid action from response: "${cleanedResponse}". Available actions: ${actionNames.join(', ')}`;
    }
}
