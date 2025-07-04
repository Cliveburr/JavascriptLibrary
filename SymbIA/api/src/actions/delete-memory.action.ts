import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class DeleteMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Preparing to delete memory...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.('No LLM provider available for memory deletion');
      return 'Memory deletion failed: No LLM provider available';
    }

    try {
      // Use original message or input from data
      const inputText = data?.input || ctx.originalMessage;
      
      // Call LLM to determine which memory IDs to delete and why
      const deletionExtractionPrompt = this.buildMemoryDeletionExtractionPrompt(inputText);
      const extractionResponse = await provider.generateSingleResponse(deletionExtractionPrompt, 'llama3:8b');
      
      // Log the LLM response
      onProgress?.(`LLM deletion analysis response: ${extractionResponse.trim()}`);
      
      // Parse extracted deletion instructions
      const deletionInstructions = this.parseDeletionInstructions(extractionResponse);
      onProgress?.(`Memory deletion instructions: ${deletionInstructions.map(del => 
        `ID: ${del.memoryId}, Reason: ${del.reason}`
      ).join(', ')}`);
      
      // Process each deletion instruction
      const deletedMemories = [];
      for (let i = 0; i < deletionInstructions.length; i++) {
        const deletionInstruction = deletionInstructions[i];
        
        onProgress?.(`Processing deletion ${i + 1}/${deletionInstructions.length} for memory ID: ${deletionInstruction.memoryId}...`);
        
        // Check for relationships before deletion (if modeled)
        const relationships = await this.checkMemoryRelationships(deletionInstruction.memoryId);
        if (relationships.length > 0) {
          onProgress?.(`Found ${relationships.length} relationship(s) for memory ${deletionInstruction.memoryId}`);
          // Handle relationship cleanup
          await this.handleRelationshipCleanup(deletionInstruction.memoryId, relationships);
        }
        
        // Simulate deletion from NoSQL database
        onProgress?.(`Deleting memory ${deletionInstruction.memoryId} from NoSQL database...`);
        const deletedFromNoSQL = await this.deleteMemoryFromNoSQL(deletionInstruction.memoryId);
        
        // Simulate deletion from Vector DB (if applicable)
        if (deletedFromNoSQL) {
          onProgress?.(`Deleting embedding for memory ${deletionInstruction.memoryId} from Vector DB...`);
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
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3:8b');
      
      onProgress?.('Memory deleted!');
      onProgress?.(summaryResponse.trim());
      
      return `Successfully deleted ${deletedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('Error deleting memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.(`Error deleting memory: ${errorMessage}`);
      return `Memory deletion failed: ${errorMessage}`;
    }
  }

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

  private async deleteEmbeddingFromVectorDB(memoryId: string): Promise<void> {
    // Stub implementation - would connect to actual vector database
    console.log(`🔢 [STUB] Deleting embedding from Vector DB:`, {
      memoryId: memoryId
    });
    
    // Simulate database operation delay
    await new Promise(resolve => setTimeout(resolve, 120));
    
    console.log(`✅ [STUB] Successfully deleted embedding for memory ${memoryId} from Vector DB`);
  }

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
}
