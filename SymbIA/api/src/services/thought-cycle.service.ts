import { ThoughtCycleContext, ActionDecision } from '@/interfaces/throuht-cycle';
import { LLMManager } from './llm.service';

/**
 * Possible action values for the thought cycle
 */
export const ACTIONS = {
  SAVE_MEMORY: 'saveMemory',
  EDIT_MEMORY: 'editMemory',
  DELETE_MEMORY: 'deleteMemory',
  SEARCH_MEMORY: 'searchMemory',
  FINALIZE: 'finalize'
} as const;

export type ActionType = typeof ACTIONS[keyof typeof ACTIONS];

/**
 * Service for managing the thought cycle execution
 */
export class ThoughtCycleService {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  /**
   * Starts a new thought cycle with the given context
   * @param ctx The context containing original message, previous messages, and executed actions
   * @returns Promise that resolves when the cycle is complete
   */
  async startCycle(ctx: ThoughtCycleContext): Promise<string> {
    console.log('@Display: Starting thought cycle...');
    
    let done = false;
    
    while (!done) {
      console.log('@Display: Thinking...');
      
      // Decide next action based on current context
      const decision = await this.decideNextAction(ctx);
      
      // Execute the decided action
      const result = await this.performAction(decision.action, ctx, decision.data);
      
      // Add the result to executed actions
      ctx.executedActions.push({
        action: decision.action,
        result,
        timestamp: new Date(),
        data: decision.data
      });
      
      // Check if we should finalize the cycle
      if (decision.action === ACTIONS.FINALIZE) {
        done = true;
      }
    }
    
    console.log('@Display: Thought cycle completed.');
    return 'Cycle completed successfully';
  }

  /**
   * Uses LLM to decide the next action based on current context
   * @param ctx The current context
   * @returns Promise that resolves to an action decision
   */
  async decideNextAction(ctx: ThoughtCycleContext): Promise<ActionDecision> {
    console.log('@Display: Thinking...');
    
    // Combine the data from ctx into a structured JSON with metadata
    const structuredInput = {
      originalMessage: ctx.originalMessage,
      previousMessages: ctx.previousMessages,
      executedActions: ctx.executedActions.map(action => ({
        action: action.action,
        timestamp: action.timestamp,
        hasResult: !!action.result
      })),
      contextMetadata: {
        totalPreviousMessages: ctx.previousMessages.length,
        totalExecutedActions: ctx.executedActions.length,
        lastActionType: ctx.executedActions.length > 0 ? 
          ctx.executedActions[ctx.executedActions.length - 1].action : null,
        analysisTimestamp: new Date().toISOString()
      },
      availableActions: Object.values(ACTIONS)
    };
    
    console.log('@Display: Analyzing context:', {
      messageLength: ctx.originalMessage.length,
      previousCount: ctx.previousMessages.length,
      actionsExecuted: ctx.executedActions.length
    });
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      console.log('@Display: No LLM provider available, using fallback logic');
      return this.getFallbackAction(ctx);
    }

    // Build prompt for action decision
    const prompt = this.buildActionDecisionPrompt(ctx);
    
    try {
      const response = await provider.generateSingleResponse(prompt, 'llama3.2:3b');

      // Parse LLM response to extract action decision
      const decision = this.parseActionDecision(response);
      
      // Validate the decision structure
      if (!decision || typeof decision.action !== 'string') {
        console.log('@Display: Invalid LLM response, using fallback decision');
        return this.getFallbackAction(ctx);
      }
      
      // Ensure action is valid
      if (!Object.values(ACTIONS).includes(decision.action as ActionType)) {
        console.log(`@Display: Invalid action "${decision.action}", defaulting to finalize`);
        return { 
          action: ACTIONS.FINALIZE, 
          data: { reason: `Invalid action provided: ${decision.action}` } 
        };
      }
      
      console.log(`@Display: Decision made - Action: ${decision.action}`);
      
      return {
        action: decision.action,
        data: decision.data || {}
      };
    } catch (error) {
      console.error('@Display: Error in decision making:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { 
        action: ACTIONS.FINALIZE, 
        data: { 
          reason: 'Error in decision making process',
          error: errorMessage 
        } 
      };
    }
  }

  /**
   * Performs the specified action with the given context and data
   * @param action The action to perform
   * @param ctx The current context
   * @param data Additional data for the action
   * @returns Promise that resolves to the action result
   */
  private async performAction(action: string, ctx: ThoughtCycleContext, data?: any): Promise<any> {
    console.log(`@Display: Executing action: ${action}`);
    
    switch (action) {
      case ACTIONS.FINALIZE:
        return this.finalizeCycle(ctx, data);
      case ACTIONS.SAVE_MEMORY:
        return this.saveMemory(ctx, data);
      case ACTIONS.EDIT_MEMORY:
        return this.editMemory(ctx, data);
      case ACTIONS.DELETE_MEMORY:
        return this.deleteMemory(ctx, data);
      case ACTIONS.SEARCH_MEMORY:
        return this.searchMemory(ctx, data);
      default:
        console.log(`@Display: Unknown action: ${action}, finalizing cycle`);
        return this.finalizeCycle(ctx, { reason: `Unknown action: ${action}` });
    }
  }

  /**
   * Finalizes the current cycle by summarizing all actions
   * @param ctx The current context
   * @param result Final result data
   * @returns Promise that resolves to the cycle summary
   */
  private async finalizeCycle(ctx: ThoughtCycleContext, result?: any): Promise<string> {
    console.log('@Display: Finalizing cycle and preparing summary...');
    
    // Create enhanced summary input for LLM
    const summaryInput = {
      originalMessage: ctx.originalMessage,
      previousMessages: ctx.previousMessages,
      executedActions: ctx.executedActions,
      finalResult: result,
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
      console.log(`@Display: ${summary}`);
      return summary;
    }

    try {
      const summaryPrompt = this.buildSummaryPrompt(ctx);
      const response = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');

      const summary = response.trim();
      console.log('@Display: Summary from LLM');
      console.log(summary);
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      const fallbackSummary = `Cycle completed with ${ctx.executedActions.length} actions executed.`;
      console.log(`@Display: ${fallbackSummary}`);
      return fallbackSummary;
    }
  }

  /**
   * Saves memory based on the current context
   * @param ctx The current context
   * @param data Data for memory saving
   * @returns Promise that resolves to save result
   */
  private async saveMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing memory to save...');
    
    // Stub implementation - will be enhanced with actual memory storage
    // This would integrate with vector storage and NoSQL database
    
    console.log('@Display: Memory saved!');
    return 'Memory saved successfully';
  }

  /**
   * Edits existing memory
   * @param ctx The current context
   * @param data Data for memory editing
   * @returns Promise that resolves to edit result
   */
  private async editMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing memory to edit...');
    
    // Stub implementation - will be enhanced with actual memory editing
    
    console.log('@Display: Memory saved!');
    return 'Memory edited successfully';
  }

  /**
   * Deletes memory
   * @param ctx The current context
   * @param data Data for memory deletion
   * @returns Promise that resolves to deletion result
   */
  private async deleteMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing to delete memory...');
    
    // Stub implementation - will be enhanced with actual memory deletion
    
    console.log('@Display: Memory deleted!');
    return 'Memory deleted successfully';
  }

  /**
   * Searches memory
   * @param ctx The current context
   * @param data Data for memory search
   * @returns Promise that resolves to search results
   */
  private async searchMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing to search memory...');
    
    // Stub implementation - will be enhanced with actual memory search
    
    console.log('@Display: Memory retrieved!');
    return 'Memory search completed';
  }

  /**
   * Builds the prompt for LLM to decide next action
   * @param ctx The current context
   * @returns The formatted prompt string
   */
  private buildActionDecisionPrompt(ctx: ThoughtCycleContext): string {
    return `
You are an AI assistant that decides the next action in a thought cycle. 

Current Context:
- Original Message: "${ctx.originalMessage}"
- Previous Messages: ${JSON.stringify(ctx.previousMessages)}
- Executed Actions: ${JSON.stringify(ctx.executedActions.map(a => ({ action: a.action, timestamp: a.timestamp })))}

Available Actions:
- finalize: Complete the current cycle and provide a summary
- saveMemory: Save information to long-term memory
- editMemory: Edit existing memory entries
- deleteMemory: Delete memory entries
- searchMemory: Search through saved memories

Based on the context, decide the next action. Respond with a JSON object containing:
{
  "action": "action_name",
  "data": { /* optional additional data */ }
}

Your response should be valid JSON only.`;
  }

  /**
   * Parses LLM response to extract action decision
   * @param response The LLM response text
   * @returns Parsed action decision
   */
  private parseActionDecision(response: string): ActionDecision {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.action) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error parsing action decision:', error);
    }
    
    // Fallback to finalize if parsing fails
    return { action: 'finalize', data: { reason: 'Failed to parse LLM response' } };
  }

  /**
   * Builds the prompt for generating cycle summary
   * @param ctx The current context
   * @returns The formatted summary prompt
   */
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

  /**
   * Provides fallback action decision when LLM is not available
   * @param ctx The current context
   * @returns Action decision based on simple keyword matching
   */
  private getFallbackAction(ctx: ThoughtCycleContext): ActionDecision {
    // Check if we should finalize based on executed actions or explicit request
    const hasMultipleActions = ctx.executedActions.length >= 2;
    const shouldFinalize = hasMultipleActions || ctx.originalMessage.toLowerCase().includes('finish');
    
    if (shouldFinalize) {
      console.log('@Display: Decided to finalize the cycle (fallback)');
      return { action: ACTIONS.FINALIZE, data: { reason: 'Cycle completion criteria met' } };
    }
    
    const message = ctx.originalMessage.toLowerCase();
    
    // Enhanced keyword analysis with priority and tags
    if (message.includes('remember') || message.includes('save') || message.includes('store')) {
      console.log('@Display: Decided to save memory (fallback)');
      return { 
        action: ACTIONS.SAVE_MEMORY, 
        data: { 
          content: ctx.originalMessage,
          priority: 'high',
          tags: ['user-request', 'information-storage']
        } 
      };
    }
    
    if (message.includes('search') || message.includes('find') || message.includes('recall')) {
      console.log('@Display: Decided to search memory (fallback)');
      return { 
        action: ACTIONS.SEARCH_MEMORY, 
        data: { 
          query: ctx.originalMessage,
          searchType: 'semantic',
          maxResults: 10
        } 
      };
    }
    
    if (message.includes('edit') || message.includes('update') || message.includes('modify')) {
      console.log('@Display: Decided to edit memory (fallback)');
      return { 
        action: ACTIONS.EDIT_MEMORY, 
        data: { 
          query: ctx.originalMessage,
          modificationType: 'content-update'
        } 
      };
    }
    
    if (message.includes('delete') || message.includes('remove') || message.includes('forget')) {
      console.log('@Display: Decided to delete memory (fallback)');
      return { 
        action: ACTIONS.DELETE_MEMORY, 
        data: { 
          query: ctx.originalMessage,
          confirmationRequired: true
        } 
      };
    }
    
    // Default to save memory if no specific action is determined
    console.log('@Display: Default to save memory (fallback)');
    return { 
      action: ACTIONS.SAVE_MEMORY, 
      data: { 
        content: ctx.originalMessage,
        priority: 'normal',
        tags: ['general-information']
      } 
    };
  }
}

// Export the main functions for compatibility with the planning document
export async function startCycle(ctx: ThoughtCycleContext): Promise<string> {
  // This function serves as a bridge to the service class
  // In a real implementation, you would inject the LLMManager dependency
  const llmManager = new LLMManager();
  const thoughtCycleService = new ThoughtCycleService(llmManager);
  return thoughtCycleService.startCycle(ctx);
}

export async function decideNextAction(ctx: ThoughtCycleContext): Promise<ActionDecision> {
  // This function serves as a bridge to the service class
  const llmManager = new LLMManager();
  const thoughtCycleService = new ThoughtCycleService(llmManager);
  return thoughtCycleService.decideNextAction(ctx);
}
