import { ContextSource, EmbeddingItem } from './llm.interface';

// Interface para configuração genérica de armazenamento vetorial
export interface VectorStorageConfig {
  collectionName: string;
}

// Interface para provedores de armazenamento vetorial
export interface VectorStorageProvider {
  // Verifica se o provedor está disponível
  isAvailable(): Promise<boolean>;
  
  // Inicializa a coleção ou banco vetorial
  initializeCollection(): Promise<void>;
  
  // Busca contexto relevante no banco vetorial
  searchContext(embedding: number[], limit?: number, threshold?: number): Promise<ContextSource[]>;
  
  // Armazena um único embedding com contexto no banco vetorial
  storeEmbedding(embeddingItem: EmbeddingItem, metadata?: Record<string, any>): Promise<void>;
  
  // Armazena múltiplos embeddings no banco vetorial
  storeEmbeddings(embeddingItems: EmbeddingItem[], metadata?: Record<string, any>): Promise<void>;
}
