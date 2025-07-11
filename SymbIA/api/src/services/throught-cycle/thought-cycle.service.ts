import { ThoughtCycleContext, ActionDecision } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../llm.service';
import { 
  FinalizeAction, 
  SaveMemoryAction, 
  EditMemoryAction, 
  DeleteMemoryAction, 
  SearchMemoryAction,
  ACTIONS,
  ActionType 
} from '../../actions';
import { DecisionService } from './decision.service';

/**
 * Service for managing the thought cycle execution
 */
export class ThoughtCycleService {

  private decisionService: DecisionService;

  constructor(
    private llmManager: LLMManager
  ) {
    this.decisionService = new DecisionService(llmManager);
  }

  /**
   * Starts a new thought cycle with progress callback support
   * @param ctx The context containing original message, previous messages, and executed actions
   * @param onProgress Callback function to receive progress updates
   * @returns Promise that resolves to the final response from the finalize action
   */
  async startCycleWithProgress(ctx: ThoughtCycleContext, onProgress?: (message: string) => void): Promise<string> {
    
    let done = false;
    let finalResult = '';
    
    while (!done) {
      onProgress?.('Thinking...');
      
      // Decide next action based on current context
      const decision = await this.decisionService.decideNextAction(ctx);
      
      // Execute the decided action with progress callback
      const result = await this.performActionWithProgress(decision.action, ctx, decision.data, onProgress);
      
      // Add the result to executed actions
      ctx.executedActions.push({
        action: decision.action,
        result,
        timestamp: new Date(),
        data: decision.data
      });
      
      // Check if we should finalize the cycle
      if (decision.action === ACTIONS.FINALIZE) {
        finalResult = result; // Capture the final response from finalize action
        done = true;
      }
    }
    
    onProgress?.('Thought cycle completed.');
    return finalResult; // Return the final response instead of a generic message
  }

  

  /**
   * Performs the specified action with the given context and data, with progress callback
   * @param action The action to perform
   * @param ctx The current context
   * @param data Additional data for the action
   * @param onProgress Callback function to receive progress updates
   * @returns Promise that resolves to the action result
   */
  private async performActionWithProgress(action: string, ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<any> {
    onProgress?.(`Executing action: ${action}`);
    
    switch (action) {
      case ACTIONS.FINALIZE:
        const finalizeAction = new FinalizeAction(this.llmManager);
        return finalizeAction.execute(ctx, data, onProgress);
      case ACTIONS.SAVE_MEMORY:
        const saveMemoryAction = new SaveMemoryAction(this.llmManager);
        return saveMemoryAction.execute(ctx, data, onProgress);
      case ACTIONS.EDIT_MEMORY:
        const editMemoryAction = new EditMemoryAction(this.llmManager);
        return editMemoryAction.execute(ctx, data, onProgress);
      case ACTIONS.DELETE_MEMORY:
        const deleteMemoryAction = new DeleteMemoryAction(this.llmManager);
        return deleteMemoryAction.execute(ctx, data, onProgress);
      case ACTIONS.SEARCH_MEMORY:
        const searchMemoryAction = new SearchMemoryAction(this.llmManager);
        return searchMemoryAction.execute(ctx, data, onProgress);
      default:
        onProgress?.(`Unknown action: ${action}, finalizing cycle`);
        const fallbackAction = new FinalizeAction(this.llmManager);
        return fallbackAction.execute(ctx, { reason: `Unknown action: ${action}` }, onProgress);
    }
  }

  // /**
  //  * Parses LLM response to extract action decision
  //  * @param response The LLM response text
  //  * @returns Parsed action decision
  //  */
  // private parseActionDecision(response: string): ActionDecision {
  //   try {
  //     // Try to extract JSON from response
  //     const jsonMatch = response.match(/\{[\s\S]*\}/);
  //     if (jsonMatch) {
  //       const parsed = JSON.parse(jsonMatch[0]);
  //       if (parsed.action) {
  //         return parsed;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error parsing action decision:', error);
  //   }
    
  //   // Fallback to finalize if parsing fails
  //   return { action: 'finalize', data: { reason: 'Failed to parse LLM response' } };
  // }

//   /**
//    * Provides fallback action decision when LLM is not available
//    * @param ctx The current context
//    * @returns Action decision based on simple keyword matching
//    */
//   private getFallbackAction(ctx: ThoughtCycleContext): ActionDecision {
//     // Check if we should finalize based on executed actions or explicit request
//     const hasMultipleActions = ctx.executedActions.length >= 2;
//     const shouldFinalize = hasMultipleActions || ctx.originalMessage.toLowerCase().includes('finish');
    
//     if (shouldFinalize) {
//       console.log('@Display: Decided to finalize the cycle (fallback)');
//       return { action: ACTIONS.FINALIZE, data: { reason: 'Cycle completion criteria met' } };
//     }
    
//     const message = ctx.originalMessage.toLowerCase();
    
//     // Enhanced keyword analysis with priority and tags
//     if (message.includes('remember') || message.includes('save') || message.includes('store')) {
//       console.log('@Display: Decided to save memory (fallback)');
//       return { 
//         action: ACTIONS.SAVE_MEMORY, 
//         data: { 
//           content: ctx.originalMessage,
//           priority: 'high',
//           tags: ['user-request', 'information-storage']
//         } 
//       };
//     }
    
//     if (message.includes('search') || message.includes('find') || message.includes('recall')) {
//       console.log('@Display: Decided to search memory (fallback)');
//       return { 
//         action: ACTIONS.SEARCH_MEMORY, 
//         data: { 
//           query: ctx.originalMessage,
//           searchType: 'semantic',
//           maxResults: 10
//         } 
//       };
//     }
    
//     if (message.includes('edit') || message.includes('update') || message.includes('modify')) {
//       console.log('@Display: Decided to edit memory (fallback)');
//       return { 
//         action: ACTIONS.EDIT_MEMORY, 
//         data: { 
//           query: ctx.originalMessage,
//           modificationType: 'content-update'
//         } 
//       };
//     }
    
//     if (message.includes('delete') || message.includes('remove') || message.includes('forget')) {
//       console.log('@Display: Decided to delete memory (fallback)');
//       return { 
//         action: ACTIONS.DELETE_MEMORY, 
//         data: { 
//           query: ctx.originalMessage,
//           confirmationRequired: true
//         } 
//       };
//     }
    
//     // Default to save memory if no specific action is determined
//     console.log('@Display: Default to save memory (fallback)');
//     return { 
//       action: ACTIONS.SAVE_MEMORY, 
//       data: { 
//         content: ctx.originalMessage,
//         priority: 'normal',
//         tags: ['general-information']
//       } 
//     };
//   }
// }

// export async function decideNextAction(ctx: ThoughtCycleContext): Promise<ActionDecision> {
//   // This function serves as a bridge to the service class
//   const llmManager = new LLMManager();
//   const thoughtCycleService = new ThoughtCycleService(llmManager);
//   return thoughtCycleService.decideNextAction(ctx);
}
