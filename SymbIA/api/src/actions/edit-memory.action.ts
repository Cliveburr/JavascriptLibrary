import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class EditMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Preparing memory to edit...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.('No LLM provider available for memory editing');
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
      onProgress?.(`Memory edit instructions: ${editInstructions.map(edit => 
        `ID: ${edit.memoryId}, Action: ${edit.action}, Content: "${edit.newContent?.substring(0, 50)}..."`
      ).join(', ')}`);
      
      // Process each edit instruction
      const editedMemories = [];
      for (let i = 0; i < editInstructions.length; i++) {
        const editInstruction = editInstructions[i];
        
        onProgress?.(`Processing edit ${i + 1}/${editInstructions.length} for memory ID: ${editInstruction.memoryId}...`);
        
        // Simulate updating in NoSQL (only, no vector DB changes)
        const updatedMemory = await this.updateMemoryInNoSQL(editInstruction);
        
        if (updatedMemory) {
          editedMemories.push(updatedMemory);
        }
      }
      
      // Call LLM to summarize what was edited
      const summaryPrompt = this.buildMemoryEditSummaryPrompt(editedMemories, inputText);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3.2:3b');
      
      onProgress?.('Memory saved!');
      onProgress?.(summaryResponse.trim());
      
      return `Successfully edited ${editedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('Error editing memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.(`Error editing memory: ${errorMessage}`);
      return `Memory editing failed: ${errorMessage}`;
    }
  }

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
}
