import type { IChatContext } from '../types/chat-context.js';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly whenToUse = "Após analisar todo histórico de mensagens, decidir que nenhuma das outras ações disponíveis é valida";
    readonly enabled = true;

    async execute(ctx: IChatContext, llmGateway: LlmGateway): Promise<void> {

        const hystory = ctx.messages
            .map(msg => {
                return { role: msg.role, content: msg.content };
            });

        // Build messages for LLM context
        const messages = [
            ...hystory,
            {
                role: 'system',
                content: 'You are a helpful AI assistant. Provide a brief, natural response to conclude the conversation based on the context provided.'
            }
        ];

        await llmGateway.invokeAsync(ctx.llmSetConfig.models.fastChat,
            messages,
            ctx.sendStartTextMessage.bind(ctx),
            ctx.sendChunkTextMessage.bind(ctx),
            ctx.sendEndTextMessage.bind(ctx),
            {
                temperature: 0.7,
                maxTokens: 200
            });
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
