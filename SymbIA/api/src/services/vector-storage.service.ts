import { ContextSource, EmbeddingItem } from '../interfaces/llm.interface';
import { VectorStorageProvider } from '../interfaces/vector-storage.interface';

/**
 * Serviço para gerenciar o armazenamento e busca de embeddings vetoriais
 * com suporte a fallback local quando o provedor externo não está disponível
 */
export class VectorStorageService {
  /**
   * Provedor de armazenamento vetorial (ex: Qdrant)
   */
  private provider: VectorStorageProvider;
  
  /**
   * Cache local de embeddings para busca em caso de falha do provedor
   */
  private localEmbeddings: EmbeddingItem[] = [];

  /**
   * Cria uma nova instância do serviço de armazenamento vetorial
   * @param provider Provedor de armazenamento vetorial a ser utilizado
   */
  constructor(provider: VectorStorageProvider) {
    this.provider = provider;
  }

  /**
   * Inicializa o serviço de armazenamento vetorial
   * @returns Promessa que resolve quando a inicialização é concluída
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
   * @returns Promessa que resolve para um booleano indicando disponibilidade
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
   * @param embedding Vetor de embedding para busca de similaridade
   * @param limit Número máximo de resultados a retornar
   * @param threshold Limiar mínimo de similaridade (entre 0 e 1)
   * @returns Promessa que resolve para um array de fontes de contexto similares
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
   * @param embeddingItem Item de embedding a ser armazenado
   * @param metadata Metadados adicionais para associar ao embedding
   * @returns Promessa que resolve quando o armazenamento é concluído
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
   * @param embeddingItems Array de itens de embedding a serem armazenados
   * @param metadata Metadados adicionais para associar aos embeddings
   * @returns Promessa que resolve quando o armazenamento é concluído
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
   * @param targetEmbedding Embedding alvo para busca de similaridade
   * @param embeddingItems Lista de embeddings armazenados localmente
   * @param limit Número máximo de resultados a retornar
   * @param threshold Limiar mínimo de similaridade (entre 0 e 1)
   * @returns Promessa que resolve para um array de fontes de contexto similares
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
   * @param embedding1 Primeiro vetor de embedding
   * @param embedding2 Segundo vetor de embedding
   * @returns Valor de similaridade entre 0 (nenhuma) e 1 (idênticos)
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
