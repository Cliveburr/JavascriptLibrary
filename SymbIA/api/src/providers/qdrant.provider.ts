import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantConfig, ContextSource, EmbeddingItem } from '../interfaces/llm.interface';
import { VectorStorageProvider } from '../interfaces/vector-storage.interface';

export class QdrantProvider implements VectorStorageProvider {
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
}
