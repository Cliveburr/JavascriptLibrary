import { ActionResult, ACTIONS, StreamChatProgress, StreamChatProgressType, ThoughtCycleContext } from '../interfaces/thought-cycle';
import { LLMManager } from '../services/llm.service';

export class FinalizeAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, onProgress: (message: StreamChatProgress) => void): Promise<ActionResult> {
    onProgress({
      type: StreamChatProgressType.Info,
      data: 'Finalizing...'
    });
    
    const provider = await this.llmManager.getAvailableProvider();
    if (!provider) {
        return {
          action: ACTIONS.FINALIZE,
          result: 'Sorry, I cannot provide a response right now as no LLM provider is available.',
          timestamp: new Date()
        };
    }

    try {
      // Build a simple response prompt
      const responsePrompt = this.buildResponsePrompt(ctx);
      
      // Generate response using conversation method
      let finalizeMessage = '';
      for await (const chunk of provider.generateResponse(responsePrompt)) {
        finalizeMessage += chunk;
        onProgress({
          type: StreamChatProgressType.TextStream,
          data: chunk
        });
      }

      finalizeMessage = finalizeMessage.trim();
      return {
        action: ACTIONS.FINALIZE,
        result: finalizeMessage,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating final response:', error);
      const fallbackResponse = this.generateFallbackResponse(ctx);
      onProgress({
        type: StreamChatProgressType.TextStream,
        data: fallbackResponse
      });
      return {
        action: ACTIONS.FINALIZE,
        result: fallbackResponse,
        timestamp: new Date()
      };
    }
  }

  private buildResponsePrompt(ctx: ThoughtCycleContext): string {
    const actionsExecuted = ctx.executedActions.length > 0 
      ? `\n\nActions performed:\n${ctx.executedActions.map(action => `- ${action.action}: ${action.result}`).join('\n')}`
      : '';

    return `You are a helpful AI assistant. Please provide a comprehensive response to the user's message based on the context and any actions that were performed.

User message: "${ctx.message}"

Previous conversation context: ${ctx.messages.length > 0 ? JSON.stringify(ctx.messages) : 'None'}${actionsExecuted}

Please provide a helpful response to the user.`;
  }

  private generateFallbackResponse(ctx: ThoughtCycleContext): string {
    if (ctx.executedActions.length > 0) {
      return `I've processed your request and performed the following actions: ${ctx.executedActions.map(action => action.action).join(', ')}. How else can I help you?`;
    }
    return "I understand your message. How can I help you further?";
  }
}
