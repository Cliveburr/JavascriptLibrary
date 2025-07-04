import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class SaveMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Preparing memory to save...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.('No LLM provider available for memory extraction');
      return 'Memory saving failed: No LLM provider available';
    }

    try {
      // Use original message or input from data
      const inputText = data?.input || ctx.originalMessage;
      
      // Call LLM to extract short, isolated memory items
      const extractionPrompt = this.buildMemoryExtractionPrompt(inputText);
      const extractionResponse = await provider.generateSingleResponse(extractionPrompt, 'llama3:8b');
      
      // Parse extracted memory items
      const memoryItems = this.parseMemoryItems(extractionResponse);
      onProgress?.(`Extracted memory items: ${memoryItems.map(item => `"${item.content.substring(0, 50)}..."`).join(', ')}`);
      
      // Process each memory item
      const savedMemories = [];
      for (let i = 0; i < memoryItems.length; i++) {
        const memoryItem = memoryItems[i];
        
        // Generate embedding for the memory item (placeholder implementation)
        onProgress?.(`Generating embedding for memory item ${i + 1}/${memoryItems.length}...`);
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
        onProgress?.(`Inserting memory ${i + 1} into NoSQL database...`);
        await this.insertMemoryToNoSQL(memoryObject);
        
        // Save embedding vector to vector database (linked by memory ID)
        onProgress?.(`Saving embedding for memory ${memoryObject.id}...`);
        await this.saveEmbeddingToVectorDB(memoryObject.id, embedding, memoryObject);
        
        savedMemories.push(memoryObject);
      }
      
      onProgress?.('Saving memory...');
      
      // Generate summary of the operation using LLM
      const summaryPrompt = this.buildMemorySummaryPrompt(savedMemories, inputText);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3:8b');
      
      onProgress?.('Memory saved!');
      onProgress?.(summaryResponse.trim());
      
      return `Successfully saved ${savedMemories.length} memory items. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('Error saving memory:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.(`Error saving memory: ${errorMessage}`);
      return `Memory saving failed: ${errorMessage}`;
    }
  }

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

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

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
}
