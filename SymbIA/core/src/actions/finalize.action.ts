import type { ActionHandler, ActionContext } from '@symbia/interfaces';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly enabled = true;

    async execute(ctx: ActionContext): Promise<void> {
        try {
            // Get the LLM set to use for this request
            const llmSetId = ctx.llmSetId;
            if (!llmSetId) {
                throw new Error('LLM set ID is required');
            }

            const llmSetService = ctx.llm.llmSetService; // Access LlmSetService through gateway
            const llmSet = await llmSetService.getLlmSetById(llmSetId);

            if (!llmSet) {
                throw new Error(`LLM set not found: ${llmSetId}`);
            }

            // Build messages for LLM context
            const messages = [
                {
                    role: 'system',
                    content: 'You are a helpful AI assistant. Provide a brief, natural response to conclude the conversation based on the context provided.'
                },
                {
                    role: 'user',
                    content: `Please provide a final response for this conversation. Keep it brief and helpful.`
                }
            ];

            const response = await ctx.llm.invoke(llmSet, 'chat', messages, {
                temperature: 0.7,
                maxTokens: 200
            });

            // Send the final message to replace the "Thinking..." placeholder
            ctx.sendMessage({
                "chat-history": false,
                "modal": "text",
                "role": "assistant",
                "content": response.content || "Conversa finalizada."
            });

        } catch (error) {
            console.error('Error in FinalizeAction:', error);
            throw new Error(`Failed to execute Finalize action: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
