import type { IChatContext } from '../types/chat-types.js';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';

export class QuestionAction implements ActionHandler {
    readonly name = "Question";
    readonly whenToUse = `If the user's request requires information that is not currently available in memory, tools, or prior context — including cases where:
    • You have never obtained this information before, or  
    • You attempted to retrieve it from memory or tools but failed.  
  In these cases, the best choice is to explicitly ask the user for the missing information.`;
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running question action...");

        const hystory = ctx.messages
            .map(msg => {
                return { role: msg.role, content: msg.content };
            });

        const messages = [
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Based on the conversation context, ask a clarifying question to get more information from the user. Keep your question concise and specific.'
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
        console.log(response.usage);
        await ctx.sendCompleteStreamTextMessage(message, response.content);

        ctx.finalizeIteration = true;
    }
}

// Export instance for registry
export const questionAction = new QuestionAction();
