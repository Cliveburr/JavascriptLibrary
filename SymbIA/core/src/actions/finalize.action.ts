import type { ActionHandler, ActionContext } from '@symbia/interfaces';

export class FinalizeAction implements ActionHandler {
    readonly name = "Finalize";
    readonly enabled = true;

    async execute(ctx: ActionContext): Promise<void> {
        // TODO: Implement LLM call with 'chat' stream on for final response
        // For now, just send a simple message
        ctx.sendMessage({
            "chat-history": false,
            "modal": "text",
            "role": "assistant",
            "content": "Processo finalizado."
        });
    }
}

// Export instance for registry
export const finalizeAction = new FinalizeAction();
