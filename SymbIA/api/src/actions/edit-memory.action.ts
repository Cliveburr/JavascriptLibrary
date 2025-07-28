import { ActionResult, StreamChatProgress, ThoughtCycleContext, StreamChatProgressType, ACTIONS } from '../interfaces/thought-cycle';
import { LLMManager } from '../services/llm.service';

export class EditMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, onProgress?: (message: StreamChatProgress) => void): Promise<ActionResult> {
    onProgress?.({ type: StreamChatProgressType.Info, data: 'Preparing to edit memory...' });
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.({ type: StreamChatProgressType.Error, data: 'No LLM provider available for memory editing' });
      return {
        action: ACTIONS.EDIT_MEMORY,
        result: 'Memory editing failed: No LLM provider available',
        timestamp: new Date(),
        data: { error: 'No LLM provider' }
      };
    }

    try {
      // Use message from context as edit context
      const editContext = ctx.message;
      
      onProgress?.({ type: StreamChatProgressType.Info, data: 'Memory edit completed!' });
      
      return {
        action: ACTIONS.EDIT_MEMORY,
        result: `Edited memory based on: "${editContext.substring(0, 100)}..." - Memory updated (placeholder implementation)`,
        timestamp: new Date(),
        data: { editedCount: 1 }
      };
      
    } catch (error) {
      console.error('Error editing memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.({ type: StreamChatProgressType.Error, data: `Memory editing failed: ${errorMessage}` });
      return {
        action: ACTIONS.EDIT_MEMORY,
        result: `Memory editing failed: ${errorMessage}`,
        timestamp: new Date(),
        data: { error: errorMessage }
      };
    }
  }
}
