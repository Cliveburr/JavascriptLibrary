import type { ActionHandler, ActionContext } from '@symbia/interfaces';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly enabled = true;

    async execute(ctx: ActionContext): Promise<void> {
        try {
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

            // Call LLM with 'fast-chat' set (equivalent to 'chat' mode in THOUGHT-CYCLE.md)
            // Note: For now using stream: false since the provider doesn't support streaming yet
            // According to THOUGHT-CYCLE.md, this should be stream: true
            const response = await ctx.llm.invoke('fast-chat', messages, {
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

            // Fallback message in case of error
            ctx.sendMessage({
                "chat-history": false,
                "modal": "text",
                "role": "assistant",
                "content": "Processo finalizado."
            });
        }
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
