import { ContextSource, EmbeddingItem } from '../interfaces/llm.interface';
import { VectorStorageProvider } from '../interfaces/vector-storage.interface';

export class VectorStorageService {
  private provider: VectorStorageProvider;
  private localEmbeddings: EmbeddingItem[] = [];

  constructor(provider: VectorStorageProvider) {
    this.provider = provider;
  }

  /**
   * Inicializa o serviço de armazenamento vetorial
   */
  async initialize(): Promise<void> {
    try {
      await this.provider.initializeCollection();
    } catch (error) {
      console.error('❌ Failed to initialize vector storage:', error);
    }
  }

  /**
   * Verifica se o serviço de armazenamento vetorial está disponível
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
   * Busca contexto relevante no banco vetorial
   */
  async searchContext(embedding: number[], limit: number = 5, threshold: number = 0.7): Promise<ContextSource[]> {
    try {
      // Tenta buscar no provider
      const isAvailable = await this.isAvailable();
      if (isAvailable) {
        return await this.provider.searchContext(embedding, limit, threshold);
      }
      
      // Se não estiver disponível, usa o fallback local
      console.log('🔄 Provider not available, using fallback search');
      return this.searchContextFallback(embedding, this.localEmbeddings, limit, threshold);
    } catch (error) {
      console.error('❌ Error searching context:', error);
      return [];
    }
  }

  /**
   * Armazena um embedding com contexto
   */
  async storeEmbedding(embeddingItem: EmbeddingItem, metadata?: Record<string, any>): Promise<void> {
    try {
      // Armazena localmente para fallback
      this.localEmbeddings.push(embeddingItem);
      
      // Tenta armazenar no provider
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
   * Armazena múltiplos embeddings
   */
  async storeEmbeddings(embeddingItems: EmbeddingItem[], metadata?: Record<string, any>): Promise<void> {
    try {
      // Armazena localmente para fallback
      this.localEmbeddings.push(...embeddingItems);
      
      // Tenta armazenar no provider
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
   * Busca por similaridade usando fallback local (quando o provider não está disponível)
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
   * Calcula similaridade coseno entre dois embeddings
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
