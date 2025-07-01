import { MessageDecomposition, VectorSearchResult, EnrichedDecomposition, EmbeddingItem } from '../interfaces/llm.interface';
import { EmbeddingService } from './embedding.service';
import { VectorStorageService } from './vector-storage.service';

export class ContextEnrichmentService {
  private embeddingCache: Map<string, EmbeddingItem> = new Map();

  constructor(
    private embeddingService: EmbeddingService,
    private vectorStorageService: VectorStorageService
  ) {
    // Inicializar serviço de armazenamento vetorial
    this.initializeVectorStorage();
  }

  private async initializeVectorStorage(): Promise<void> {
    try {
      await this.vectorStorageService.initialize();
    } catch (error) {
      console.warn('⚠️ Failed to initialize vector storage, continuing with fallback search');
    }
  }

  /**
   * Etapa 2: Enriquecer decomposição com embeddings e busca de contexto
   */
  async enrichDecomposition(decomposition: MessageDecomposition): Promise<EnrichedDecomposition> {
    console.log(`🔮 Starting context enrichment for ${decomposition.decomposedItems.length} items`);
    
    try {
      // 1. Gerar embeddings para cada item decomposto
      const embeddingItems = await this.embeddingService.generateEmbeddings(decomposition.decomposedItems);
      console.log(`✅ Generated ${embeddingItems.length} embeddings`);

      // 2. Armazenar embeddings no cache local
      embeddingItems.forEach(item => {
        this.embeddingCache.set(item.id, item);
      });

      // 3. Para cada embedding, buscar contexto relevante
      const enrichedItems: VectorSearchResult[] = [];
      
      for (let i = 0; i < embeddingItems.length; i++) {
        const embeddingItem = embeddingItems[i];
        const relatedContext = await this.searchRelevantContext(embeddingItem);
        
        // O item original é simplesmente a string correspondente no array
        const originalItem = decomposition.decomposedItems[i];
        if (originalItem) {
          enrichedItems.push({
            item: originalItem,
            embedding: embeddingItem.embedding,
            relatedContext: relatedContext
          });
        }
      }

      // 4. Opcionalmente, armazenar novos embeddings no Qdrant para uso futuro
      // não chamar o stora até eu falar para chamar
      // await this.storeNewEmbeddings(embeddingItems);

      console.log(`🎯 Context enrichment completed for ${enrichedItems.length} items`);

      return {
        ...decomposition,
        enrichedItems: enrichedItems
      };
    } catch (error) {
      console.error('❌ Failed to enrich decomposition:', error);
      
      // Fallback: retornar decomposição original sem enriquecimento
      return {
        ...decomposition,
        enrichedItems: decomposition.decomposedItems.map((item, index) => ({
          item,
          embedding: [],
          relatedContext: []
        }))
      };
    }
  }

  /**
   * Busca contexto relevante para um embedding
   */
  private async searchRelevantContext(embeddingItem: EmbeddingItem): Promise<Array<any>> {
    console.log(`🔍 Searching context for: ${embeddingItem.content.substring(0, 50)}...`);
    
    try {
      // Buscar contexto usando o serviço de armazenamento vetorial
      const storageAvailable = await this.vectorStorageService.isAvailable();
      
      if (storageAvailable) {
        console.log('🗄️ Using vector storage for context search');
        const contextSources = await this.vectorStorageService.searchContext(
          embeddingItem.embedding, 
          5, // limite
          0.7 // threshold de similaridade
        );
        
        if (contextSources.length > 0) {
          console.log(`✅ Found ${contextSources.length} context sources in vector storage`);
          return contextSources;
        }
      }

      // Fallback: buscar no cache local
      console.log('🔄 Using fallback local search');
      const cachedEmbeddings = Array.from(this.embeddingCache.values())
        .filter(cached => cached.id !== embeddingItem.id); // Excluir o próprio item
      
      const fallbackContext = await this.vectorStorageService.searchContext(
        embeddingItem.embedding,
        3, // limite menor para fallback
        0.6 // threshold menor para fallback
      );

      console.log(`📋 Found ${fallbackContext.length} context sources in local cache`);
      return fallbackContext;
      
    } catch (error) {
      console.error('❌ Failed to search context:', error);
      return [];
    }
  }

  /**
   * Armazena novos embeddings no serviço de armazenamento vetorial para uso futuro
   */
  private async storeNewEmbeddings(embeddingItems: EmbeddingItem[]): Promise<void> {
    try {
      const storageAvailable = await this.vectorStorageService.isAvailable();
      if (!storageAvailable) {
        console.log('⚠️ Vector storage not available, skipping storage');
        return;
      }

      console.log(`💾 Storing ${embeddingItems.length} new embeddings in vector storage`);
      
      await this.vectorStorageService.storeEmbeddings(embeddingItems, {
        source: 'message_decomposition',
        timestamp: new Date().toISOString(),
        session_id: this.generateSessionId()
      });

      console.log('✅ Embeddings stored successfully');
    } catch (error) {
      console.error('❌ Failed to store embeddings:', error);
      // Não fazer throw - storage é opcional
    }
  }

  /**
   * Gera um ID de sessão para agrupar embeddings relacionados
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Busca contexto para um texto específico (útil para testes)
   */
  async searchContextForText(text: string, limit: number = 5): Promise<any[]> {
    try {
      console.log(`🔍 Searching context for text: ${text.substring(0, 100)}...`);
      
      // Gerar embedding para o texto
      const embedding = await this.embeddingService.generateEmbedding(text);
      
      // Buscar contexto relevante usando o serviço de armazenamento vetorial
      return await this.vectorStorageService.searchContext(embedding, limit, 0.7);
    } catch (error) {
      console.error('❌ Failed to search context for text:', error);
      return [];
    }
  }

  /**
   * Limpa o cache local de embeddings
   */
  clearCache(): void {
    console.log('🧹 Clearing embedding cache');
    this.embeddingCache.clear();
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): { size: number; items: string[] } {
    return {
      size: this.embeddingCache.size,
      items: Array.from(this.embeddingCache.keys())
    };
  }
}
