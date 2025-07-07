import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class FinalizeAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Finalizing cycle and generating response...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      // Fallback simplificado quando não há provider disponível
      const fallbackResponse = this.generateFallbackResponse(ctx);
      onProgress?.(fallbackResponse);
      return fallbackResponse;
    }

    try {
      const responsePrompt = this.buildResponsePrompt(ctx);
      const response = await provider.generateSingleResponse(responsePrompt, 'llama3:8b');

      const finalResponse = response.trim();
      onProgress?.('Response generated');
      return finalResponse;
    } catch (error) {
      console.error('Error generating final response:', error);
      const fallbackResponse = this.generateFallbackResponse(ctx);
      onProgress?.(fallbackResponse);
      return fallbackResponse;
    }
  }

  private buildResponsePrompt(ctx: ThoughtCycleContext): string {
    const actionsExecuted = ctx.executedActions.length > 0 
      ? `\nActions executed during this conversation:
${ctx.executedActions.map(action => 
  `- ${action.action}: ${JSON.stringify(action.result)}`
).join('\n')}`
      : '';

    return `You are responding to a user's message. Based on the conversation context and any actions taken, provide a direct and helpful response.

Original user message: "${ctx.originalMessage}"

Previous conversation context: ${ctx.previousMessages.length > 0 ? JSON.stringify(ctx.previousMessages) : 'None'}${actionsExecuted}

Provide a concise, direct response to the user's original message. Focus on answering their question or addressing their request. Keep the response natural and conversational, without mentioning technical details about the system or actions executed unless directly relevant to the user's request.`;
  }

  private generateFallbackResponse(ctx: ThoughtCycleContext): string {
    // Generate a simple but helpful fallback response
    const hasMemoryActions = ctx.executedActions.some(action => 
      ['saveMemory', 'searchMemory', 'editMemory', 'deleteMemory'].includes(action.action)
    );

    if (hasMemoryActions) {
      return `I've processed your request regarding "${ctx.originalMessage}". The relevant memory operations have been completed.`;
    }

    return `I understand your request: "${ctx.originalMessage}". I've processed this and executed the necessary actions to help you.`;
  }
}
