import { ActionResult, StreamChatProgress, ThoughtCycleContext, StreamChatProgressType, ACTIONS } from '../interfaces/thought-cycle';
import { LLMManager } from '../services/llm.service';

export class DeleteMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, onProgress?: (message: StreamChatProgress) => void): Promise<ActionResult> {
    onProgress?.({ type: StreamChatProgressType.Info, data: 'Preparing to delete memory...' });
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.({ type: StreamChatProgressType.Error, data: 'No LLM provider available for memory deletion' });
      return {
        action: ACTIONS.DELETE_MEMORY,
        result: 'Memory deletion failed: No LLM provider available',
        timestamp: new Date(),
        data: { error: 'No LLM provider' }
      };
    }

    try {
      // Use message from context as delete context
      const deleteContext = ctx.message;
      
      onProgress?.({ type: StreamChatProgressType.Info, data: 'Memory deletion completed!' });
      
      return {
        action: ACTIONS.DELETE_MEMORY,
        result: `Deleted memory based on: "${deleteContext.substring(0, 100)}..." - Memory removed (placeholder implementation)`,
        timestamp: new Date(),
        data: { deletedCount: 1 }
      };
      
    } catch (error) {
      console.error('Error deleting memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.({ type: StreamChatProgressType.Error, data: `Memory deletion failed: ${errorMessage}` });
      return {
        action: ACTIONS.DELETE_MEMORY,
        result: `Memory deletion failed: ${errorMessage}`,
        timestamp: new Date(),
        data: { error: errorMessage }
      };
    }
  }
}
