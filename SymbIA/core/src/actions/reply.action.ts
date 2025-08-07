import type { IChatContext } from '../types/chat-types';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';
import { parseMessageForPrompt } from '../helpers/index';

export class ReplyAction implements ActionHandler {
    readonly name = "Reply";
    readonly whenToUse = `Use this action when the agent needs to send a direct response to the user without performing any other internal action. This includes the following cases:
  ** To answer the user's request when enough information is available
  ** To ask the user a clarifying question when essential information is missing
  ** To conclude the conversation when no further action is needed`;
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running Reply action...");

        const history = ctx.messages
            .map(msg => parseMessageForPrompt(msg));

        const messages = [
            {
                role: 'system',
                content: `You are a helpful AI assistant. Based on the current context, determine whether to:

- Provide a final answer if you have enough information,
- Ask the user a clarifying question if something is missing,
- Or conclude the conversation if no further action is needed.

Your response should be short and natural. Speak directly to the user.`
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
        console.log("End of Reply!");
    }
}

// Export instance for registry
export const replyAction = new ReplyAction();
