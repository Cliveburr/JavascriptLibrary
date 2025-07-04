import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class FinalizeAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Finalizing cycle and preparing summary...');
    
    // Create enhanced summary input for LLM
    const summaryInput = {
      originalMessage: ctx.originalMessage,
      previousMessages: ctx.previousMessages,
      executedActions: ctx.executedActions,
      finalResult: data,
      cycleMetrics: {
        totalActions: ctx.executedActions.length,
        cycleStartTime: ctx.executedActions[0]?.timestamp,
        cycleEndTime: new Date(),
        actionTypes: [...new Set(ctx.executedActions.map(a => a.action))]
      }
    };
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      const summary = `Thought cycle completed successfully. 

Original request: "${ctx.originalMessage}"
Actions executed: ${ctx.executedActions.length}
- ${ctx.executedActions.map(a => a.action).join(', ')}

The cycle processed the user's request and executed the necessary actions to fulfill it.`;
      onProgress?.(summary);
      return summary;
    }

    try {
      const summaryPrompt = this.buildSummaryPrompt(ctx);
      const response = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');

      const summary = response.trim();
      onProgress?.('Summary from LLM');
      onProgress?.(summary);
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      const fallbackSummary = `Cycle completed with ${ctx.executedActions.length} actions executed.`;
      onProgress?.(fallbackSummary);
      return fallbackSummary;
    }
  }

  private buildSummaryPrompt(ctx: ThoughtCycleContext): string {
    return `
Summarize the following thought cycle execution:

Original Message: "${ctx.originalMessage}"
Previous Messages: ${JSON.stringify(ctx.previousMessages)}

Executed Actions:
${ctx.executedActions.map(action => 
  `- ${action.action} at ${action.timestamp.toISOString()}: ${JSON.stringify(action.result)}`
).join('\n')}

Provide a concise summary of what was accomplished in this thought cycle. Keep it under 200 words and focus on the key outcomes.`;
  }
}
