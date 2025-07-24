import { ThoughtCycleContext, ACTIONS, StreamChatProgress, StreamChatProgressType } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../llm.service';

import { DecisionService } from './decision.service';
import { ActionService } from './action.service';
import { IChat } from '@/models/chat.model';

/**
 * Service for managing the thought cycle execution
 */
export class ThoughtCycleService {

  private decisionService: DecisionService;
  private actionService: ActionService;

  constructor(
    llmManager: LLMManager
  ) {
    this.decisionService = new DecisionService(llmManager);
    this.actionService = new ActionService(llmManager);
  }

  /**
   * Starts a new thought cycle with progress callback support
   * @param ctx The context containing original message, previous messages, and executed actions
   * @param onProgress Callback function to receive progress updates
   * @returns Promise that resolves to the final response from the finalize action
   */
  async runThoughtCycle(ctx: ThoughtCycleContext, onProgress: (message: StreamChatProgress) => void): Promise<void> {
    while (true) {
      onProgress({
        type: StreamChatProgressType.Info,
        data: 'Thinking...'
      });
      
      // Decide next action based on current context
      const action = await this.decisionService.decideNextAction(ctx);
      
      // Execute the decided action with progress callback
      const result = await this.actionService.runAction(action, ctx, onProgress);
      
      // Add the result to executed actions
      ctx.executedActions.push(result);
      
      // Check if we should finalize the cycle
      if (action === ACTIONS.FINALIZE || this.checkStuckCycle(ctx)) {
        return;
      }
    }
  }

  checkStuckCycle(ctx: ThoughtCycleContext): boolean {

    // Check if the last 3 actions is the same
    if (this.checkRepeatingActions(ctx)) {
      return true;
    }

    return false;
  }

  checkRepeatingActions(ctx: ThoughtCycleContext): boolean {
    let rep = 1;
    const count = 3;
    const lastActionType = ctx.executedActions[ctx.executedActions.length - 1].action;
    for (let i = ctx.executedActions.length - 2; i > ctx.executedActions.length - count; i--) {
      if (ctx.executedActions[i].action == lastActionType) {
        rep++;
      } else {
        break;
      }
    }
    return rep >= count;
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
