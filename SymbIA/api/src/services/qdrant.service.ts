import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantConfig, ContextSource, EmbeddingItem } from '../interfaces/llm.interface';

export class QdrantService {
  private client: QdrantClient | null = null;
  private config: QdrantConfig;
  private isInitialized: boolean = false;

  constructor(config?: Partial<QdrantConfig>) {
    this.config = {
      host: config?.host || 'localhost',
      port: config?.port || 6333, 
      collectionName: config?.collectionName || 'symbia_context',
      ...config
    };

    try {
      this.client = new QdrantClient({
        host: this.config.host,
        port: this.config.port,
        apiKey: this.config.apiKey
      });
      console.log(`🔗 Qdrant client initialized: ${this.config.host}:${this.config.port}`);
    } catch (error) {
      console.error('❌ Failed to initialize Qdrant client:', error);
      console.warn('⚠️ Continuing without Qdrant - will use fallback search');
    }
  }

  /**
   * Inicializa a coleção no Qdrant se não existir
   */
  async initializeCollection(): Promise<void> {
    if (!this.client) {
      console.warn('⚠️ Qdrant client not available, skipping collection initialization');
      return;
    }

    try {
      console.log(`🚀 Initializing collection: ${this.config.collectionName}`);
      
      // Verificar se a coleção existe
      const collections = await this.client.getCollections();
      const collectionExists = collections.collections?.some(
        (c: any) => c.name === this.config.collectionName
      );

      if (!collectionExists) {
        console.log('📦 Creating new collection...');
        await this.client.createCollection(this.config.collectionName, {
          vectors: {
            size: 128, // Tamanho do embedding que definimos
            distance: 'Cosine' // Métrica de distância
          }
        });
        console.log('✅ Collection created successfully');
      } else {
        console.log('✅ Collection already exists');
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize collection:', error);
      console.warn('⚠️ Continuing without Qdrant collection - search will use fallback');
      this.isInitialized = false;
    }
  }

  /**
   * Verifica se o Qdrant está disponível
   */
  async isAvailable(): Promise<boolean> {
    if (!this.client) return false;
    
    try {
      await this.client.getCollections();
      return true;
    } catch (error) {
      console.warn('⚠️ Qdrant not available:', error);
      return false;
    }
  }

  /**
   * Busca contexto relevante no banco vetorial
   */
  async searchContext(embedding: number[], limit: number = 5, threshold: number = 0.7): Promise<ContextSource[]> {
    if (!this.client || !this.isInitialized) {
      console.warn('⚠️ Qdrant not available, returning empty context');
      return [];
    }

    try {
      console.log(`🔍 Searching for similar vectors (limit: ${limit}, threshold: ${threshold})`);
      
      const searchResult = await this.client.search(this.config.collectionName, {
        vector: embedding,
        limit: limit,
        score_threshold: threshold,
        with_payload: true,
        with_vector: false
      });

      const contextSources: ContextSource[] = [];
      
      if (Array.isArray(searchResult)) {
        for (const point of searchResult) {
          if (point.payload && point.score !== undefined) {
            contextSources.push({
              id: String(point.id),
              content: String(point.payload.content || ''),
              score: point.score,
              metadata: (point.payload.metadata as Record<string, any>) || {}
            });
          }
        }
      }

      console.log(`✅ Found ${contextSources.length} relevant context sources`);
      return contextSources;
    } catch (error) {
      console.error('❌ Failed to search context:', error);
      return [];
    }
  }

  /**
   * Armazena um embedding com contexto no banco vetorial
   */
  async storeEmbedding(embeddingItem: EmbeddingItem, metadata?: Record<string, any>): Promise<void> {
    if (!this.client || !this.isInitialized) {
      console.warn('⚠️ Qdrant not available, skipping storage');
      return;
    }

    try {
      console.log(`💾 Storing embedding for item: ${embeddingItem.id}`);
      
      await this.client.upsert(this.config.collectionName, {
        wait: true,
        points: [{
          id: embeddingItem.id,
          vector: embeddingItem.embedding,
          payload: {
            content: embeddingItem.content,
            timestamp: new Date().toISOString(),
            metadata: metadata || {}
          }
        }]
      });

      console.log('✅ Embedding stored successfully');
    } catch (error) {
      console.error('❌ Failed to store embedding:', error);
    }
  }

  /**
   * Armazena múltiplos embeddings
   */
  async storeEmbeddings(embeddingItems: EmbeddingItem[], metadata?: Record<string, any>): Promise<void> {
    if (!this.client || !this.isInitialized) {
      console.warn('⚠️ Qdrant not available, skipping storage');
      return;
    }

    try {
      console.log(`💾 Storing ${embeddingItems.length} embeddings`);
      
      const points = embeddingItems.map(item => ({
        id: item.id,
        vector: item.embedding,
        payload: {
          content: item.content,
          timestamp: new Date().toISOString(),
          metadata: metadata || {}
        }
      }));

      await this.client.upsert(this.config.collectionName, {
        wait: true,
        points: points
      });

      console.log('✅ All embeddings stored successfully');
    } catch (error) {
      console.error('❌ Failed to store embeddings:', error);
    }
  }

  /**
   * Busca por similaridade usando fallback local (quando Qdrant não está disponível)
   */
  async searchContextFallback(
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
