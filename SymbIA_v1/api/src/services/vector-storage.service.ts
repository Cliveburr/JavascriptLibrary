import { ContextSource, EmbeddingItem } from '../interfaces/llm.interface';
import { VectorStorageProvider } from '../interfaces/vector-storage.interface';

/**
 * Service to manage storage and search of vector embeddings
 * with support for local fallback when external provider is not available
 */
export class VectorStorageService {
  /**
   * Vector storage provider (e.g., Qdrant)
   */
  private provider: VectorStorageProvider;
  
  /**
   * Local embeddings cache for search in case of provider failure
   */
  private localEmbeddings: EmbeddingItem[] = [];

  /**
   * Creates a new instance of the vector storage service
   * @param provider Vector storage provider to be used
   */
  constructor(provider: VectorStorageProvider) {
    this.provider = provider;
  }

  /**
   * Initializes the vector storage service
   * @returns Promise that resolves when initialization is complete
   */
  async initialize(): Promise<void> {
    try {
      await this.provider.initializeCollection();
    } catch (error) {
      console.error('❌ Failed to initialize vector storage:', error);
    }
  }

  /**
   * Checks if the vector storage service is available
   * @returns Promise that resolves to a boolean indicating availability
   */
  async isAvailable(): Promise<boolean> {
    try {
      return await this.provider.isAvailable();
    } catch (error) {
      console.error('❌ Error checking vector storage availability:', error);
      return false;
    }
  }

  /**
   * Search for relevant context in the vector database
   * @param embedding Embedding vector for similarity search
   * @param limit Maximum number of results to return
   * @param threshold Minimum similarity threshold (between 0 and 1)
   * @returns Promise that resolves to an array of similar context sources
   */
  async searchContext(embedding: number[], limit: number = 5, threshold: number = 0.7): Promise<ContextSource[]> {
    try {
      // Try to search in the provider
      const isAvailable = await this.isAvailable();
      if (isAvailable) {
        return await this.provider.searchContext(embedding, limit, threshold);
      }
      
      // If not available, use local fallback
      console.log('🔄 Provider not available, using fallback search');
      return this.searchContextFallback(embedding, this.localEmbeddings, limit, threshold);
    } catch (error) {
      console.error('❌ Error searching context:', error);
      return [];
    }
  }

  /**
   * Store an embedding with context
   * @param embeddingItem Embedding item to be stored
   * @param metadata Additional metadata to associate with the embedding
   * @returns Promise that resolves when storage is complete
   */
  async storeEmbedding(embeddingItem: EmbeddingItem, metadata?: Record<string, any>): Promise<void> {
    try {
      // Store locally for fallback
      this.localEmbeddings.push(embeddingItem);
      
      // Try to store in the provider
      const isAvailable = await this.isAvailable();
      if (isAvailable) {
        await this.provider.storeEmbedding(embeddingItem, metadata);
      } else {
        console.log('⚠️ Provider not available, embedding stored only locally');
      }
    } catch (error) {
      console.error('❌ Error storing embedding:', error);
    }
  }

  /**
   * Store multiple embeddings
   * @param embeddingItems Array of embedding items to be stored
   * @param metadata Additional metadata to associate with the embeddings
   * @returns Promise that resolves when storage is complete
   */
  async storeEmbeddings(embeddingItems: EmbeddingItem[], metadata?: Record<string, any>): Promise<void> {
    try {
      // Store locally for fallback
      this.localEmbeddings.push(...embeddingItems);
      
      // Try to store in the provider
      const isAvailable = await this.isAvailable();
      if (isAvailable) {
        await this.provider.storeEmbeddings(embeddingItems, metadata);
      } else {
        console.log('⚠️ Provider not available, embeddings stored only locally');
      }
    } catch (error) {
      console.error('❌ Error storing embeddings:', error);
    }
  }

  /**
   * Search for similarity using local fallback (when provider is not available)
   * @param targetEmbedding Target embedding for similarity search
   * @param embeddingItems List of locally stored embeddings
   * @param limit Maximum number of results to return
   * @param threshold Minimum similarity threshold (between 0 and 1)
   * @returns Promise that resolves to an array of similar context sources
   */
  private async searchContextFallback(
    targetEmbedding: number[], 
    embeddingItems: EmbeddingItem[], 
    limit: number = 5, 
    threshold: number = 0.7
  ): Promise<ContextSource[]> {
    console.log('🔄 Using fallback similarity search');
    
    const similarities = embeddingItems.map(item => ({
      item,
      similarity: this.calculateCosineSimilarity(targetEmbedding, item.embedding)
    }));

    return similarities
      .filter(s => s.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(s => ({
        id: s.item.id,
        content: s.item.content,
        score: s.similarity,
        metadata: { fallback: true }
      }));
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param embedding1 First embedding vector
   * @param embedding2 Second embedding vector
   * @returns Similarity value between 0 (none) and 1 (identical)
   */
  private calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}
