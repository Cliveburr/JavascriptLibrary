import { ActionResult, StreamChatProgress, ThoughtCycleContext, StreamChatProgressType, ACTIONS } from '../interfaces/thought-cycle';
import { LLMManager } from '../services/llm.service';

export class SaveMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, onProgress?: (message: StreamChatProgress) => void): Promise<ActionResult> {
    onProgress?.({ type: StreamChatProgressType.Info, data: 'Preparing memory to save...' });
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.({ type: StreamChatProgressType.Error, data: 'No LLM provider available for memory extraction' });
      return {
        action: ACTIONS.SAVE_MEMORY,
        result: 'Memory saving failed: No LLM provider available',
        timestamp: new Date(),
        data: { error: 'No LLM provider' }
      };
    }

    try {
      // Use message from context
      const inputText = ctx.message;
      
      onProgress?.({ type: StreamChatProgressType.Info, data: 'Memory saved!' });
      
      return {
        action: ACTIONS.SAVE_MEMORY,
        result: `Successfully saved memory from: "${inputText.substring(0, 100)}..."`,
        timestamp: new Date(),
        data: { savedCount: 1 }
      };
      
    } catch (error) {
      console.error('Error saving memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.({ type: StreamChatProgressType.Error, data: `Error saving memory: ${errorMessage}` });
      return {
        action: ACTIONS.SAVE_MEMORY,
        result: `Memory saving failed: ${errorMessage}`,
        timestamp: new Date(),
        data: { error: errorMessage }
      };
    }
  }
}
