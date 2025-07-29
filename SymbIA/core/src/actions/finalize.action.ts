import type { ActionHandler, ActionContext } from '@symbia/interfaces';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly enabled = true;

    async execute(ctx: ActionContext): Promise<void> {
        try {
            // MOCK: Por enquanto usar resposta mock para demonstrar o fluxo
            // TODO: Descomentar quando Ollama estiver disponível com modelos
            /*
            // Get the LLM set to use for this request
            const llmSetId = ctx.llmSetId || 'ollama-fast-chat'; // fallback to default
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
            */

            const response = {
                content: "Olá! Sistema funcionando perfeitamente. O ciclo de pensamento foi executado com sucesso!"
            };

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
