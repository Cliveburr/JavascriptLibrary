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
        //messages.forEach(m => console.log(`${m.role}: ${m.content}`));

        // Call LLM to get decision using the LLM set configuration
        const response = await this.llmGateway.invoke(
            ctx.llmSetConfig.models.reasoningHeavy,
            messages,
            {
                temperature: 0.2, // Low temperature for consistent decisions
                maxTokens: 50, // Short response expected
            }
        );
        //console.log(response.content);
        //TODO: ir diminuindo a temperatura progressivamente e a precisão

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

        const systemPrompt = `You are an AI assistant that must decide which action to take next to answer what the user wants. 
Based on the conversation history and the user's current message, respond with ONLY the exact name of one action from the available actions list.

Available Actions (respond with EXACT name only):

${actions.map(a => `- ${a.name}\n  When to use: ${a.whenToUse}`).join('\n')}

Instructions:
- Respond with ONLY the action name, nothing else
- Always select the action that will best allow you to fulfill the user's request
- If no further action is possible or needed, choose "Finalize"`;

        return [
            { role: 'system', content: systemPrompt },
            ...history,
        ];
    }

    /**
     * Extract action name from LLM response
     */
    private extractActionName(response: string, actions: ActionHandler[]): string {
        if (!response?.trim()) {
            console.warn('Empty response from LLM for decision!');
            return 'Finalize';
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
