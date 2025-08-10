import type { IStreamChatContext } from '../thought/stream-chat';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/llm-gateway.ts';
import { parseMessageForPrompt } from '../helpers/index';

export class ReplyAction implements ActionHandler {
    readonly name = "Reply";
    readonly whenToUse = `Use this action ONLY when:
    ** There is absolutely no chance the answer or relevant context exists in memory
    ** You already have enough information to fully satisfy the user's request`;
    readonly enabled = true;

    async execute(ctx: IStreamChatContext, llmGateway: LlmGateway): Promise<void> {
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
