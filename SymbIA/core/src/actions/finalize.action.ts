import type { IChatContext } from '../types/chat-types.js';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly whenToUse = "After reviewing the entire conversation history, determine that none of the other available actions are applicable and there is no further useful action to take.";
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running finalize action...");

        const hystory = ctx.messages
            .map(msg => {
                return { role: msg.role, content: msg.content };
            });

        // Build messages for LLM context
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Provide a brief, natural response to conclude the conversation based on the context provided.'
            },
            ...hystory
        ];

        const message = await ctx.sendPrepareStreamTextMessage('assistant', 'text');
        const response = await llmGateway.invokeAsync(ctx.llmSetConfig.models.fastChat,
            messages,
            ctx.sendStreamTextMessage.bind(ctx),
            {
                temperature: 0.7,
                maxTokens: 200
            });
        await ctx.sendCompleteStreamTextMessage(message, response.content);

        ctx.finalizeIteration = true;
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
