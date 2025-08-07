import type { IChatContext } from '../types/chat-types';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';
import { parseMessageForPrompt } from '../helpers/index';

export class QuestionAction implements ActionHandler {
    readonly name = "Question";
    readonly whenToUse = `Use this if the user's request cannot be completed because information is missing, including cases where:
  • You have never obtained this information before, OR
  • You tried to retrieve it from memory/tools but failed.
  In this case, ask the user for the missing info.`;
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running question action...");

        const history = ctx.messages
            .map(msg => parseMessageForPrompt(msg));

        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Based on the conversation context, ask a clarifying question to get more information from the user. Keep your question concise and specific.'
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
        console.log("End of question!");
    }
}

// Export instance for registry
export const questionAction = new QuestionAction();
