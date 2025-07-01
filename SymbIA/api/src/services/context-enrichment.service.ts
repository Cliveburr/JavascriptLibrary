import { MessageDecomposition, VectorSearchResult, EnrichedDecomposition, EmbeddingItem } from '../interfaces/llm.interface';
import { EmbeddingService } from './embedding.service';
import { VectorStorageService } from './vector-storage.service';

/**
 * Serviço responsável por enriquecer decomposições de mensagens com contexto vetorial
 */
export class ContextEnrichmentService {
  /**
   * Cache local de embeddings para evitar recálculos
   */
  private embeddingCache: Map<string, EmbeddingItem> = new Map();

  /**
   * Cria uma nova instância do serviço de enriquecimento de contexto
   * @param embeddingService Serviço para geração de embeddings
   * @param vectorStorageService Serviço para armazenamento e busca vetorial
   */
  constructor(
    private embeddingService: EmbeddingService,
    private vectorStorageService: VectorStorageService
  ) {
    // Inicializar serviço de armazenamento vetorial
    this.initializeVectorStorage();
  }

  /**
   * Inicializa o serviço de armazenamento vetorial
   */
  private async initializeVectorStorage(): Promise<void> {
    try {
      await this.vectorStorageService.initialize();
    } catch (error) {
      console.warn('⚠️ Failed to initialize vector storage, continuing with fallback search');
    }
  }

  /**
   * Etapa 2: Enriquecer decomposição com embeddings e busca de contexto
   * @param decomposition Decomposição da mensagem a ser enriquecida
   * @returns Promessa que resolve para a decomposição enriquecida com contexto
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
   * @param embeddingItem Item de embedding para buscar contexto relacionado
   * @returns Promessa que resolve para um array de fontes de contexto relacionadas
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
   * @param embeddingItems Itens de embedding a serem armazenados
   * @returns Promessa que resolve quando o armazenamento é concluído
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
   * @returns String única representando o ID da sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Busca contexto para um texto específico (útil para testes)
   * @param text Texto para o qual se deseja buscar contexto
   * @param limit Número máximo de resultados a retornar
   * @returns Promessa que resolve para um array de fontes de contexto relacionadas
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
   * @returns Objeto com tamanho do cache e lista de IDs armazenados
   */
  getCacheStats(): { size: number; items: string[] } {
    return {
      size: this.embeddingCache.size,
      items: Array.from(this.embeddingCache.keys())
    };
  }
}
