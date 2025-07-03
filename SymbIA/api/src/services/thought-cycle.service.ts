import { ThoughtCycleContext, ActionDecision } from '@/interfaces/throuht-cycle';
import { LLMManager } from './llm.service';

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
        timestamp: new Date()
      });
      
      // Check if we should finalize the cycle
      if (decision.action === 'finalize') {
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
    // This is a stub implementation - will be enhanced with actual LLM integration
    console.log('@Display: Analyzing context and deciding next action...');
    
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
      console.log(`@Display: Decided on action: ${decision.action}`);
      
      return decision;
    } catch (error) {
      console.error('Error deciding next action:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { action: 'finalize', data: { reason: 'Error in decision making', error: errorMessage } };
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
      case 'finalize':
        return this.finalizeCycle(ctx, data);
      case 'saveMemory':
        return this.saveMemory(ctx, data);
      case 'editMemory':
        return this.editMemory(ctx, data);
      case 'deleteMemory':
        return this.deleteMemory(ctx, data);
      case 'searchMemory':
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
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      const summary = `Cycle completed. Executed ${ctx.executedActions.length} actions.`;
      console.log(`@Display: ${summary}`);
      return summary;
    }

    try {
      const summaryPrompt = this.buildSummaryPrompt(ctx);
      const response = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');

      const summary = response.trim();
      console.log(`@Display: ${summary}`);
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
    const hasExecutedActions = ctx.executedActions.length > 0;
    const shouldFinalize = hasExecutedActions || ctx.originalMessage.toLowerCase().includes('finish');
    
    if (shouldFinalize) {
      console.log('@Display: Decided to finalize the cycle (fallback)');
      return { action: 'finalize', data: { reason: 'Cycle completion criteria met' } };
    }
    
    // Example decision logic based on keywords
    if (ctx.originalMessage.toLowerCase().includes('remember') || ctx.originalMessage.toLowerCase().includes('save')) {
      console.log('@Display: Decided to save memory (fallback)');
      return { action: 'saveMemory', data: { content: ctx.originalMessage } };
    }
    
    if (ctx.originalMessage.toLowerCase().includes('search') || ctx.originalMessage.toLowerCase().includes('find')) {
      console.log('@Display: Decided to search memory (fallback)');
      return { action: 'searchMemory', data: { query: ctx.originalMessage } };
    }
    
    if (ctx.originalMessage.toLowerCase().includes('edit') || ctx.originalMessage.toLowerCase().includes('update')) {
      console.log('@Display: Decided to edit memory (fallback)');
      return { action: 'editMemory', data: { content: ctx.originalMessage } };
    }
    
    if (ctx.originalMessage.toLowerCase().includes('delete') || ctx.originalMessage.toLowerCase().includes('remove')) {
      console.log('@Display: Decided to delete memory (fallback)');
      return { action: 'deleteMemory', data: { query: ctx.originalMessage } };
    }
    
    // Default to finalize if no specific action is determined
    console.log('@Display: No specific action determined, finalizing (fallback)');
    return { action: 'finalize', data: { reason: 'No specific action required' } };
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
