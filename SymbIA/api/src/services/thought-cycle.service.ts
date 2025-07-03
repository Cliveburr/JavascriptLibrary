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
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      console.log('@Display: No LLM provider available for memory extraction');
      return 'Memory saving failed: No LLM provider available';
    }

    try {
      // Use original message or input from data
      const inputText = data?.input || ctx.originalMessage;
      
      // Call LLM to extract short, isolated memory items
      const extractionPrompt = this.buildMemoryExtractionPrompt(inputText);
      const extractionResponse = await provider.generateSingleResponse(extractionPrompt, 'llama3.2:3b');
      
      // Parse extracted memory items
      const memoryItems = this.parseMemoryItems(extractionResponse);
      console.log('@Display: Extracted memory items:', memoryItems.map(item => `"${item.content.substring(0, 50)}..."`));
      
      // Process each memory item
      const savedMemories = [];
      for (let i = 0; i < memoryItems.length; i++) {
        const memoryItem = memoryItems[i];
        
        // Generate embedding for the memory item (placeholder implementation)
        console.log(`@Display: Generating embedding for memory item ${i + 1}/${memoryItems.length}...`);
        const embedding = await this.generateMemoryEmbedding(memoryItem.content);
        
        // Create memory object for NoSQL database (stub/fake object)
        const memoryObject = {
          id: `memory_${Date.now()}_${i}`,
          content: memoryItem.content,
          category: memoryItem.category || 'general',
          tags: memoryItem.tags || [],
          timestamp: new Date().toISOString(),
          source: 'user_interaction',
          context: {
            originalMessage: ctx.originalMessage,
            sessionId: `session_${Date.now()}`,
            userId: 'user_001' // placeholder
          }
        };
        
        // Insert into NoSQL database (stub implementation)
        console.log(`@Display: Inserting memory ${i + 1} into NoSQL database...`);
        await this.insertMemoryToNoSQL(memoryObject);
        
        // Save embedding vector to vector database (linked by memory ID)
        console.log(`@Display: Saving embedding for memory ${memoryObject.id}...`);
        await this.saveEmbeddingToVectorDB(memoryObject.id, embedding, memoryObject);
        
        savedMemories.push(memoryObject);
      }
      
      console.log('@Display: Saving memory...');
      
      // Generate summary of the operation using LLM
      const summaryPrompt = this.buildMemorySummaryPrompt(savedMemories, inputText);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');
      
      console.log('@Display: Memory saved!');
      console.log(`@Display: ${summaryResponse.trim()}`);
      
      return `Successfully saved ${savedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('@Display: Error saving memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `Memory saving failed: ${errorMessage}`;
    }
  }

  /**
   * Edits existing memory
   * @param ctx The current context
   * @param data Data for memory editing
   * @returns Promise that resolves to edit result
   */
  private async editMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing memory to edit...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      console.log('@Display: No LLM provider available for memory editing');
      return 'Memory editing failed: No LLM provider available';
    }

    try {
      // Use original message or input from data
      const inputText = data?.input || ctx.originalMessage;
      
      // Call LLM to extract which memory IDs to edit and what their new contents should be
      const editExtractionPrompt = this.buildMemoryEditExtractionPrompt(inputText);
      const extractionResponse = await provider.generateSingleResponse(editExtractionPrompt, 'llama3.2:3b');
      
      // Parse extracted edit instructions
      const editInstructions = this.parseEditInstructions(extractionResponse);
      console.log('@Display: Memory edit instructions:', editInstructions.map(edit => 
        `ID: ${edit.memoryId}, Action: ${edit.action}, Content: "${edit.newContent?.substring(0, 50)}..."`
      ));
      
      // Process each edit instruction
      const editedMemories = [];
      for (let i = 0; i < editInstructions.length; i++) {
        const editInstruction = editInstructions[i];
        
        console.log(`@Display: Processing edit ${i + 1}/${editInstructions.length} for memory ID: ${editInstruction.memoryId}...`);
        
        // Simulate updating in NoSQL (only, no vector DB changes)
        const updatedMemory = await this.updateMemoryInNoSQL(editInstruction);
        
        if (updatedMemory) {
          editedMemories.push(updatedMemory);
        }
      }
      
      // Call LLM to summarize what was edited
      const summaryPrompt = this.buildMemoryEditSummaryPrompt(editedMemories, inputText);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');
      
      console.log('@Display: Memory saved!');
      console.log(`@Display: ${summaryResponse.trim()}`);
      
      return `Successfully edited ${editedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('@Display: Error editing memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `Memory editing failed: ${errorMessage}`;
    }
  }

  /**
   * Deletes memory
   * @param ctx The current context
   * @param data Data for memory deletion
   * @returns Promise that resolves to deletion result
   */
  private async deleteMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing to delete memory...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      console.log('@Display: No LLM provider available for memory deletion');
      return 'Memory deletion failed: No LLM provider available';
    }

    try {
      // Use original message or input from data
      const inputText = data?.input || ctx.originalMessage;
      
      // Call LLM to determine which memory IDs to delete and why
      const deletionExtractionPrompt = this.buildMemoryDeletionExtractionPrompt(inputText);
      const extractionResponse = await provider.generateSingleResponse(deletionExtractionPrompt, 'llama3.2:3b');
      
      // Log the LLM response
      console.log('@Display: LLM deletion analysis response:', extractionResponse.trim());
      
      // Parse extracted deletion instructions
      const deletionInstructions = this.parseDeletionInstructions(extractionResponse);
      console.log('@Display: Memory deletion instructions:', deletionInstructions.map(del => 
        `ID: ${del.memoryId}, Reason: ${del.reason}`
      ));
      
      // Process each deletion instruction
      const deletedMemories = [];
      for (let i = 0; i < deletionInstructions.length; i++) {
        const deletionInstruction = deletionInstructions[i];
        
        console.log(`@Display: Processing deletion ${i + 1}/${deletionInstructions.length} for memory ID: ${deletionInstruction.memoryId}...`);
        
        // Check for relationships before deletion (if modeled)
        const relationships = await this.checkMemoryRelationships(deletionInstruction.memoryId);
        if (relationships.length > 0) {
          console.log(`@Display: Found ${relationships.length} relationship(s) for memory ${deletionInstruction.memoryId}`);
          // Handle relationship cleanup
          await this.handleRelationshipCleanup(deletionInstruction.memoryId, relationships);
        }
        
        // Simulate deletion from NoSQL database
        console.log(`@Display: Deleting memory ${deletionInstruction.memoryId} from NoSQL database...`);
        const deletedFromNoSQL = await this.deleteMemoryFromNoSQL(deletionInstruction.memoryId);
        
        // Simulate deletion from Vector DB (if applicable)
        if (deletedFromNoSQL) {
          console.log(`@Display: Deleting embedding for memory ${deletionInstruction.memoryId} from Vector DB...`);
          await this.deleteEmbeddingFromVectorDB(deletionInstruction.memoryId);
        }
        
        if (deletedFromNoSQL) {
          deletedMemories.push({
            memoryId: deletionInstruction.memoryId,
            reason: deletionInstruction.reason,
            deletedAt: new Date().toISOString(),
            hadRelationships: relationships.length > 0
          });
        }
      }
      
      // Call LLM to summarize deletion
      const summaryPrompt = this.buildMemoryDeletionSummaryPrompt(deletedMemories, inputText);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');
      
      console.log('@Display: Memory deleted!');
      console.log(`@Display: ${summaryResponse.trim()}`);
      
      return `Successfully deleted ${deletedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('@Display: Error deleting memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return `Memory deletion failed: ${errorMessage}`;
    }
  }

  /**
   * Searches memory
   * @param ctx The current context
   * @param data Data for memory search
   * @returns Promise that resolves to search results
   */
  private async searchMemory(ctx: ThoughtCycleContext, data?: any): Promise<string> {
    console.log('@Display: Preparing to search memory...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      console.log('@Display: No LLM provider available for memory search');
      return 'Memory search failed: No LLM provider available';
    }

    try {
      // Use data.query or fallback to original message for search context
      const searchContext = data?.query || ctx.originalMessage;
      
      // Step 1: Use LLM to extract search topics and key terms from current context
      console.log('@Display: Extracting search topics from context...');
      const topicExtractionPrompt = this.buildSearchTopicExtractionPrompt(searchContext, ctx);
      const topicResponse = await provider.generateSingleResponse(topicExtractionPrompt, 'llama3.2:3b');
      
      // Parse extracted search terms
      const searchTerms = this.parseSearchTerms(topicResponse);
      console.log('@Display: Search terms extracted:', searchTerms.terms.map(term => `"${term}"`));
      console.log('@Display: Search categories:', searchTerms.categories);
      
      // Step 2: Generate embeddings for search terms (optional stub)
      console.log('@Display: Generating embeddings for search terms...');
      const searchEmbeddings = [];
      for (const term of searchTerms.terms) {
        const embedding = await this.generateMemoryEmbedding(term);
        searchEmbeddings.push({ term, embedding });
      }
      
      // Step 3: Simulate querying vector DB and retrieving memory items
      console.log('@Display: Querying vector database...');
      const vectorResults = await this.queryVectorDatabase(searchEmbeddings, searchTerms.categories);
      
      console.log('@Display: Retrieving matched memories from NoSQL...');
      const memoryItems = await this.retrieveMemoriesFromNoSQL(vectorResults);
      
      // Step 4: Summarize results with LLM
      console.log('@Display: Summarizing search results...');
      const summaryPrompt = this.buildSearchResultsSummaryPrompt(searchContext, searchTerms, memoryItems);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');
      
      console.log('@Display: Memory retrieved!');
      console.log(`@Display: Found ${memoryItems.length} relevant memories`);
      console.log(`@Display: ${summaryResponse.trim()}`);
      
      return `Successfully found ${memoryItems.length} relevant memories. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('Error in memory search:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('@Display: Memory search failed:', errorMessage);
      return `Memory search failed: ${errorMessage}`;
    }
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

  /**
   * Builds the prompt for LLM to extract memory items from input text
   * @param inputText The input text to extract memories from
   * @returns The formatted prompt string
   */
  private buildMemoryExtractionPrompt(inputText: string): string {
    return `
You are an AI assistant that extracts important information from user messages that should be saved as memory items.

Input Text: "${inputText}"

Extract short, isolated memory items from this input. Each memory item should be:
- A single, complete piece of information
- Self-contained and understandable without additional context
- Relevant for future reference
- No more than 1-2 sentences

Respond with a JSON array of memory items in this format:
[
  {
    "content": "The actual memory content",
    "category": "general|personal|factual|preference|instruction",
    "tags": ["relevant", "tags"]
  }
]

Focus on extracting factual information, preferences, instructions, or important details that would be useful to remember later.

Your response should be valid JSON only.`;
  }

  /**
   * Parses LLM response to extract memory items
   * @param response The LLM response text
   * @returns Array of parsed memory items
   */
  private parseMemoryItems(response: string): Array<{ content: string; category?: string; tags?: string[] }> {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item.content && typeof item.content === 'string');
        }
      }
    } catch (error) {
      console.error('Error parsing memory items:', error);
    }
    
    // Fallback: create a single memory item from the original input
    return [{
      content: response.trim(),
      category: 'general',
      tags: ['extracted']
    }];
  }

  /**
   * Generates embedding for a memory item (placeholder implementation)
   * @param content The content to generate embedding for
   * @returns Promise that resolves to embedding vector
   */
  private async generateMemoryEmbedding(content: string): Promise<number[]> {
    // This is a placeholder implementation
    // In a real scenario, this would use the EmbeddingService
    // For now, generate a simple hash-based embedding
    const hash = this.simpleHash(content);
    const embedding = new Array(384).fill(0).map((_, i) => 
      Math.sin(hash + i) * Math.cos(hash * i / 100)
    );
    return embedding;
  }

  /**
   * Simple hash function for generating deterministic numbers from strings
   * @param str The string to hash
   * @returns A numeric hash
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Inserts memory object into NoSQL database (stub implementation)
   * @param memoryObject The memory object to insert
   * @returns Promise that resolves when insertion is complete
   */
  private async insertMemoryToNoSQL(memoryObject: any): Promise<void> {
    // Stub implementation - would connect to actual NoSQL database
    console.log(`📝 [STUB] Inserting memory to NoSQL:`, {
      id: memoryObject.id,
      content: memoryObject.content.substring(0, 50) + '...',
      category: memoryObject.category,
      timestamp: memoryObject.timestamp
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Saves embedding vector to vector database (stub implementation)
   * @param memoryId The ID of the memory object
   * @param embedding The embedding vector
   * @param metadata Additional metadata
   * @returns Promise that resolves when saving is complete
   */
  private async saveEmbeddingToVectorDB(memoryId: string, embedding: number[], metadata: any): Promise<void> {
    // Stub implementation - would connect to actual vector database
    console.log(`🔢 [STUB] Saving embedding to Vector DB:`, {
      memoryId,
      embeddingSize: embedding.length,
      metadata: {
        category: metadata.category,
        timestamp: metadata.timestamp
      }
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  /**
   * Builds the prompt for LLM to generate memory operation summary
   * @param savedMemories Array of saved memory objects
   * @param originalInput The original input text
   * @returns The formatted prompt string
   */
  private buildMemorySummaryPrompt(savedMemories: any[], originalInput: string): string {
    return `
Summarize the memory saving operation that was just completed.

Original Input: "${originalInput}"

Saved Memories:
${savedMemories.map((memory, index) => 
  `${index + 1}. [${memory.category}] ${memory.content}`
).join('\n')}

Provide a brief, user-friendly summary of what was saved to memory. Keep it under 100 words and focus on what the user can expect to find in their saved memories later.

Example: "I've saved 3 key pieces of information about your preferences to memory, including your favorite programming language and work schedule. These details will help me provide more personalized assistance in future conversations."`;
  }

  /**
   * Builds the prompt for LLM to extract memory edit instructions from input text
   * @param inputText The input text containing edit instructions
   * @returns The formatted prompt string
   */
  private buildMemoryEditExtractionPrompt(inputText: string): string {
    return `
You are an AI assistant that extracts memory editing instructions from user messages.

Input Text: "${inputText}"

Extract memory editing instructions from this input. Look for:
- References to specific memories to edit (IDs, descriptions, content snippets)
- What changes should be made (content updates, corrections, additions)
- Which parts of memories need modification

Respond with a JSON array of edit instructions in this format:
[
  {
    "memoryId": "memory_id_or_description",
    "action": "update|append|replace",
    "newContent": "The new or updated content",
    "reason": "Why this edit is needed"
  }
]

If no specific memory IDs are mentioned, use descriptive identifiers based on the content being referenced.

Your response should be valid JSON only.`;
  }

  /**
   * Parses LLM response to extract memory edit instructions
   * @param response The LLM response text
   * @returns Array of parsed edit instructions
   */
  private parseEditInstructions(response: string): Array<{
    memoryId: string;
    action: string;
    newContent?: string;
    reason?: string;
  }> {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item.memoryId && item.action);
        }
      }
    } catch (error) {
      console.error('Error parsing edit instructions:', error);
    }
    
    // Fallback: create a generic edit instruction
    return [{
      memoryId: `memory_${Date.now()}`,
      action: 'update',
      newContent: response.trim(),
      reason: 'Generic memory update based on user input'
    }];
  }

  /**
   * Updates memory object in NoSQL database (stub implementation)
   * @param editInstruction The edit instruction containing memory ID and new content
   * @returns Promise that resolves to updated memory object or null if not found
   */
  private async updateMemoryInNoSQL(editInstruction: {
    memoryId: string;
    action: string;
    newContent?: string;
    reason?: string;
  }): Promise<any | null> {
    // Stub implementation - would connect to actual NoSQL database
    console.log(`📝 [STUB] Updating memory in NoSQL:`, {
      memoryId: editInstruction.memoryId,
      action: editInstruction.action,
      newContent: editInstruction.newContent?.substring(0, 50) + '...',
      reason: editInstruction.reason
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 120));
    
    // Create mock updated memory object
    const updatedMemory = {
      id: editInstruction.memoryId,
      content: editInstruction.newContent || 'Updated content',
      action: editInstruction.action,
      lastModified: new Date().toISOString(),
      reason: editInstruction.reason || 'User requested edit'
    };
    
    return updatedMemory;
  }

  /**
   * Builds the prompt for LLM to generate memory edit summary
   * @param editedMemories Array of edited memory objects
   * @param originalInput The original input text
   * @returns The formatted prompt string
   */
  private buildMemoryEditSummaryPrompt(editedMemories: any[], originalInput: string): string {
    return `
Summarize the memory editing operation that was just completed.

Original Input: "${originalInput}"

Edited Memories:
${editedMemories.map((memory, index) => 
  `${index + 1}. [${memory.action}] ID: ${memory.id} - ${memory.content}`
).join('\n')}

Provide a brief, user-friendly summary of what was edited in memory. Keep it under 100 words and focus on what changes were made and how they improve the stored information.

Example: "I've updated 2 memories based on your request. The programming preference has been changed to include TypeScript, and your work schedule information has been corrected to reflect the new hours. These updates ensure more accurate assistance in future conversations."`;
  }

  /**
   * Builds the prompt for LLM to extract memory deletion instructions from input text
   * @param inputText The input text containing deletion instructions
   * @returns The formatted prompt string
   */
  private buildMemoryDeletionExtractionPrompt(inputText: string): string {
    return `
You are an AI assistant that extracts memory deletion instructions from user messages.

Input Text: "${inputText}"

Extract memory deletion instructions from this input. Look for:
- References to specific memories to delete (IDs, descriptions, content snippets)
- Reasons why these memories should be deleted
- Any conditions or criteria for deletion

Respond with a JSON array of deletion instructions in this format:
[
  {
    "memoryId": "memory_id_or_description",
    "reason": "Why this memory should be deleted",
    "criteria": "Any specific criteria mentioned"
  }
]

If no specific memory IDs are mentioned, use descriptive identifiers based on the content being referenced.
If the request is to delete all memories, use "all" as the memoryId.

Your response should be valid JSON only.`;
  }

  /**
   * Parses LLM response to extract memory deletion instructions
   * @param response The LLM response text
   * @returns Array of parsed deletion instructions
   */
  private parseDeletionInstructions(response: string): Array<{
    memoryId: string;
    reason: string;
    criteria?: string;
  }> {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item.memoryId && item.reason);
        }
      }
    } catch (error) {
      console.error('Error parsing deletion instructions:', error);
    }
    
    // Fallback: create a generic deletion instruction
    return [{
      memoryId: `memory_${Date.now()}`,
      reason: 'Generic memory deletion based on user input',
      criteria: response.trim()
    }];
  }

  /**
   * Checks for relationships associated with a memory ID (stub implementation)
   * @param memoryId The memory ID to check relationships for
   * @returns Promise that resolves to array of relationship objects
   */
  private async checkMemoryRelationships(memoryId: string): Promise<Array<{
    id: string;
    type: string;
    relatedMemoryId: string;
  }>> {
    // Stub implementation - would check actual relationship database
    console.log(`🔗 [STUB] Checking relationships for memory ID: ${memoryId}`);
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 80));
    
    // Mock some relationships for demonstration
    const mockRelationships = [];
    
    // Randomly decide if this memory has relationships (30% chance)
    if (Math.random() < 0.3) {
      mockRelationships.push({
        id: `rel_${Date.now()}`,
        type: 'references',
        relatedMemoryId: `memory_${Date.now() + 1000}`
      });
    }
    
    return mockRelationships;
  }

  /**
   * Handles cleanup of relationships when deleting a memory (stub implementation)
   * @param memoryId The memory ID being deleted
   * @param relationships Array of relationships to handle
   * @returns Promise that resolves when cleanup is complete
   */
  private async handleRelationshipCleanup(memoryId: string, relationships: Array<{
    id: string;
    type: string;
    relatedMemoryId: string;
  }>): Promise<void> {
    // Stub implementation - would handle actual relationship cleanup
    console.log(`🧹 [STUB] Cleaning up relationships for memory ID: ${memoryId}`, {
      relationshipCount: relationships.length,
      relationshipTypes: relationships.map(r => r.type)
    });
    
    for (const relationship of relationships) {
      console.log(`🧹 [STUB] Removing relationship: ${relationship.id} (${relationship.type})`);
      // Simulate relationship cleanup delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  /**
   * Deletes memory object from NoSQL database (stub implementation)
   * @param memoryId The memory ID to delete
   * @returns Promise that resolves to true if deleted, false if not found
   */
  private async deleteMemoryFromNoSQL(memoryId: string): Promise<boolean> {
    // Stub implementation - would connect to actual NoSQL database
    console.log(`🗑️ [STUB] Deleting memory from NoSQL:`, {
      memoryId: memoryId
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Simulate successful deletion (90% success rate)
    const success = Math.random() < 0.9;
    
    if (success) {
      console.log(`✅ [STUB] Successfully deleted memory ${memoryId} from NoSQL`);
    } else {
      console.log(`❌ [STUB] Memory ${memoryId} not found in NoSQL database`);
    }
    
    return success;
  }

  /**
   * Deletes embedding vector from vector database (stub implementation)
   * @param memoryId The ID of the memory whose embedding should be deleted
   * @returns Promise that resolves when deletion is complete
   */
  private async deleteEmbeddingFromVectorDB(memoryId: string): Promise<void> {
    // Stub implementation - would connect to actual vector database
    console.log(`🔢 [STUB] Deleting embedding from Vector DB:`, {
      memoryId: memoryId
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 120));
    
    console.log(`✅ [STUB] Successfully deleted embedding for memory ${memoryId} from Vector DB`);
  }

  /**
   * Builds the prompt for LLM to generate memory deletion summary
   * @param deletedMemories Array of deleted memory objects
   * @param originalInput The original input text
   * @returns The formatted prompt string
   */
  private buildMemoryDeletionSummaryPrompt(deletedMemories: Array<{
    memoryId: string;
    reason: string;
    deletedAt: string;
    hadRelationships: boolean;
  }>, originalInput: string): string {
    return `
Summarize the memory deletion operation that was just completed.

Original Input: "${originalInput}"

Deleted Memories:
${deletedMemories.map((memory, index) => 
  `${index + 1}. ID: ${memory.memoryId} - Reason: ${memory.reason}${memory.hadRelationships ? ' (had relationships)' : ''}`
).join('\n')}

Provide a brief, user-friendly summary of what was deleted from memory. Keep it under 100 words and focus on what was removed and why it was necessary.

Example: "I've successfully deleted 2 outdated memories as requested. This included removing old preference information that was no longer accurate and clearing duplicate entries. Your memory storage is now cleaner and more organized."`;
  }

  /**
   * Builds the prompt for LLM to extract search topics and key terms from context
   * @param searchContext The search context/query
   * @param ctx The current thought cycle context
   * @returns The formatted prompt string
   */
  private buildSearchTopicExtractionPrompt(searchContext: string, ctx: ThoughtCycleContext): string {
    return `
You are an AI assistant that extracts search topics and key terms from user queries for memory retrieval.

Search Context: "${searchContext}"
Original Message: "${ctx.originalMessage}"
Previous Messages: ${JSON.stringify(ctx.previousMessages)}

Extract search topics and key terms that would be useful for finding relevant memories. Consider:
- Main concepts and subjects mentioned
- Specific entities, names, or technical terms
- Categories of information being sought
- Related topics that might be relevant

Respond with a JSON object in this format:
{
  "terms": ["key", "search", "terms"],
  "categories": ["category1", "category2"],
  "searchType": "semantic|keyword|mixed",
  "priority": "high|medium|low"
}

Focus on extracting terms that would help find the most relevant stored memories.

Your response should be valid JSON only.`;
  }

  /**
   * Parses LLM response to extract search terms and categories
   * @param response The LLM response text
   * @returns Parsed search terms object
   */
  private parseSearchTerms(response: string): {
    terms: string[];
    categories: string[];
    searchType: string;
    priority: string;
  } {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.terms && Array.isArray(parsed.terms)) {
          return {
            terms: parsed.terms,
            categories: parsed.categories || ['general'],
            searchType: parsed.searchType || 'semantic',
            priority: parsed.priority || 'medium'
          };
        }
      }
    } catch (error) {
      console.error('Error parsing search terms:', error);
    }
    
    // Fallback: extract basic terms from the response
    const words = response.toLowerCase().match(/\b\w+\b/g) || [];
    const uniqueWords = [...new Set(words)].filter(word => word.length > 3);
    
    return {
      terms: uniqueWords.slice(0, 5), // Take first 5 unique words
      categories: ['general'],
      searchType: 'keyword',
      priority: 'medium'
    };
  }

  /**
   * Queries vector database with search embeddings (stub implementation)
   * @param searchEmbeddings Array of search term embeddings
   * @param categories Categories to filter by
   * @returns Promise that resolves to vector search results
   */
  private async queryVectorDatabase(searchEmbeddings: Array<{
    term: string;
    embedding: number[];
  }>, categories: string[]): Promise<Array<{
    memoryId: string;
    similarity: number;
    matchedTerm: string;
  }>> {
    // Stub implementation - would query actual vector database
    console.log(`🔍 [STUB] Querying Vector DB with ${searchEmbeddings.length} search embeddings`);
    console.log(`🔍 [STUB] Filtering by categories:`, categories);
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate mock results based on search terms
    const mockResults = [];
    
    for (const { term, embedding } of searchEmbeddings) {
      // Simulate finding 1-3 matches per search term
      const numMatches = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numMatches; i++) {
        mockResults.push({
          memoryId: `memory_${term}_${Date.now()}_${i}`,
          similarity: 0.8 + (Math.random() * 0.2), // Random similarity between 0.8-1.0
          matchedTerm: term
        });
      }
    }
    
    // Sort by similarity and take top 10 results
    const sortedResults = mockResults.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
    
    console.log(`🔍 [STUB] Found ${sortedResults.length} vector matches`);
    return sortedResults;
  }

  /**
   * Retrieves memory objects from NoSQL database using vector search results (stub implementation)
   * @param vectorResults Results from vector database search
   * @returns Promise that resolves to array of memory objects
   */
  private async retrieveMemoriesFromNoSQL(vectorResults: Array<{
    memoryId: string;
    similarity: number;
    matchedTerm: string;
  }>): Promise<Array<{
    id: string;
    content: string;
    category: string;
    tags: string[];
    timestamp: string;
    similarity: number;
    matchedTerm: string;
  }>> {
    // Stub implementation - would query actual NoSQL database
    console.log(`📝 [STUB] Retrieving ${vectorResults.length} memories from NoSQL`);
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const mockMemories = [];
    
    for (const vectorResult of vectorResults) {
      // Create mock memory object
      const mockMemory = {
        id: vectorResult.memoryId,
        content: `Memory content related to "${vectorResult.matchedTerm}". This is a simulated memory that would contain relevant information about the search topic.`,
        category: Math.random() > 0.5 ? 'general' : 'personal',
        tags: [vectorResult.matchedTerm, 'relevant', 'search-result'],
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last week
        similarity: vectorResult.similarity,
        matchedTerm: vectorResult.matchedTerm
      };
      
      mockMemories.push(mockMemory);
    }
    
    console.log(`📝 [STUB] Retrieved ${mockMemories.length} memory objects`);
    return mockMemories;
  }

  /**
   * Builds the prompt for LLM to summarize search results
   * @param searchContext The original search context
   * @param searchTerms The extracted search terms
   * @param memoryItems The retrieved memory items
   * @returns The formatted prompt string
   */
  private buildSearchResultsSummaryPrompt(searchContext: string, searchTerms: {
    terms: string[];
    categories: string[];
    searchType: string;
    priority: string;
  }, memoryItems: Array<{
    id: string;
    content: string;
    category: string;
    tags: string[];
    timestamp: string;
    similarity: number;
    matchedTerm: string;
  }>): string {
    return `
Summarize the memory search results for the user.

Original Search Context: "${searchContext}"
Search Terms Used: ${searchTerms.terms.join(', ')}
Categories Searched: ${searchTerms.categories.join(', ')}

Retrieved Memories:
${memoryItems.map((memory, index) => 
  `${index + 1}. [${memory.category}] (${(memory.similarity * 100).toFixed(1)}% match) ${memory.content.substring(0, 100)}...`
).join('\n')}

Provide a concise, user-friendly summary of what was found in memory. Include:
- How many relevant memories were found
- What types of information were retrieved
- Brief overview of the key findings
- How these memories relate to the search query

Keep it under 150 words and focus on what the user can learn from the retrieved memories.

Example: "I found 3 relevant memories related to your programming preferences. The search revealed your preference for TypeScript over JavaScript, your experience with React projects, and notes about your preferred development setup. These memories show a consistent pattern of preferring type-safe, component-based development approaches."`;
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
