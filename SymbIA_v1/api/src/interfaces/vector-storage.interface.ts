import { ContextSource, EmbeddingItem } from './llm.interface';

// Interface para configuração genérica de armazenamento vetorial
export interface VectorStorageConfig {
  /**
   * Nome da coleção para armazenamento dos vetores
   */
  collectionName: string;
}

// Interface para provedores de armazenamento vetorial
export interface VectorStorageProvider {
  /**
   * Verifica se o provedor de armazenamento vetorial está disponível
   * @returns Promessa que resolve para um booleano indicando disponibilidade
   */
  isAvailable(): Promise<boolean>;
  
  /**
   * Inicializa a coleção ou banco vetorial
   * Cria a coleção se não existir com as configurações apropriadas
   * @returns Promessa que resolve quando a inicialização é concluída
   */
  initializeCollection(): Promise<void>;
  
  /**
   * Busca contexto relevante no banco vetorial baseado em similaridade
   * @param embedding Vetor de embedding para busca de similaridade
   * @param limit Número máximo de resultados a retornar
   * @param threshold Limiar mínimo de similaridade (entre 0 e 1)
   * @returns Promessa que resolve para um array de fontes de contexto similares
   */
  searchContext(embedding: number[], limit?: number, threshold?: number): Promise<ContextSource[]>;
  
  /**
   * Armazena um único embedding com contexto no banco vetorial
   * @param embeddingItem Item de embedding a ser armazenado
   * @param metadata Metadados adicionais para associar ao embedding
   * @returns Promessa que resolve quando o armazenamento é concluído
   */
  storeEmbedding(embeddingItem: EmbeddingItem, metadata?: Record<string, any>): Promise<void>;
  
  /**
   * Armazena múltiplos embeddings no banco vetorial de uma só vez
   * @param embeddingItems Array de itens de embedding a serem armazenados
   * @param metadata Metadados adicionais para associar aos embeddings
   * @returns Promessa que resolve quando o armazenamento é concluído
   */
  storeEmbeddings(embeddingItems: EmbeddingItem[], metadata?: Record<string, any>): Promise<void>;
}
