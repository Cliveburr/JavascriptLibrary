import type { IChatContext } from '../types/chat-types';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';
import { parseMessageForPrompt } from '../helpers/index';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly whenToUse = "Use this when none of the other actions are applicable and there is no further useful action to take.";
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running finalize action...");

        const history = ctx.messages
            .map(msg => parseMessageForPrompt(msg));

        // Build messages for LLM context
        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Provide a brief, natural response to conclude the conversation based on the context provided.'
            },
            ...history
        ];

        const message = await ctx.sendPrepareMessage('assistant', 'text');
        const response = await llmGateway.invokeAsync(ctx.llmSetConfig.models.fastChat,
            messages,
            ctx.sendStreamMessage.bind(ctx),
            {
                temperature: 0.7,
                maxTokens: 200
            });

        message.content = response.content;

        if (response.usage) {
            message.promptTokens = response.usage.promptTokens;
            message.completionTokens = response.usage.completionTokens;
        }
        await ctx.sendCompleteMessage(message);

        ctx.finalizeIteration = true;
        console.log("End of finalize!");
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
