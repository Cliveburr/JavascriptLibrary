import { ThoughtCycleContext } from '@/interfaces/throuht-cycle';
import { LLMManager } from '../services/llm.service';

export class SearchMemoryAction {
  private llmManager: LLMManager;

  constructor(llmManager: LLMManager) {
    this.llmManager = llmManager;
  }

  async execute(ctx: ThoughtCycleContext, data?: any, onProgress?: (message: string) => void): Promise<string> {
    onProgress?.('Preparing to search memory...');
    
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      onProgress?.('No LLM provider available for memory search');
      return 'Memory search failed: No LLM provider available';
    }

    try {
      // Use data.query or fallback to original message for search context
      const searchContext = data?.query || ctx.originalMessage;
      
      // Step 1: Use LLM to extract search topics and key terms from current context
      onProgress?.('Extracting search topics from context...');
      const topicExtractionPrompt = this.buildSearchTopicExtractionPrompt(searchContext, ctx);
      const topicResponse = await provider.generateSingleResponse(topicExtractionPrompt, 'llama3:8b');
      
      // Parse extracted search terms
      const searchTerms = this.parseSearchTerms(topicResponse);
      onProgress?.(`Search terms extracted: ${searchTerms.terms.map(term => `"${term}"`).join(', ')}`);
      onProgress?.(`Search categories: ${searchTerms.categories.join(', ')}`);
      
      // Step 2: Generate embeddings for search terms (optional stub)
      onProgress?.('Generating embeddings for search terms...');
      const searchEmbeddings = [];
      for (const term of searchTerms.terms) {
        const embedding = await this.generateMemoryEmbedding(term);
        searchEmbeddings.push({ term, embedding });
      }
      
      // Step 3: Simulate querying vector DB and retrieving memory items
      onProgress?.('Querying vector database...');
      const vectorResults = await this.queryVectorDatabase(searchEmbeddings, searchTerms.categories);
      
      onProgress?.('Retrieving matched memories from NoSQL...');
      const memoryItems = await this.retrieveMemoriesFromNoSQL(vectorResults);
      
      // Step 4: Summarize results with LLM
      onProgress?.('Summarizing search results...');
      const summaryPrompt = this.buildSearchResultsSummaryPrompt(searchContext, searchTerms, memoryItems);
      const summaryResponse = await provider.generateSingleResponse(summaryPrompt, 'llama3:8b');
      
      onProgress?.('Memory retrieved!');
      onProgress?.(`Found ${memoryItems.length} relevant memories`);
      onProgress?.(summaryResponse.trim());
      
      return `Successfully found ${memoryItems.length} relevant memories. ${summaryResponse.trim()}`;
      
    } catch (error) {
      console.error('Error in memory search:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onProgress?.(`Memory search failed: ${errorMessage}`);
      return `Memory search failed: ${errorMessage}`;
    }
  }

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

  private async generateMemoryEmbedding(content: string): Promise<number[]> {
    // This is a placeholder implementation
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
