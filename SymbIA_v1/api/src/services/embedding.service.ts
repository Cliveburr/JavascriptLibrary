import { LLMManager } from './llm.service';
import { EmbeddingItem } from '../interfaces/llm.interface';

/**
 * Serviço responsável pela geração de embeddings vetoriais a partir de textos
 */
export class EmbeddingService {
  /**
   * Cria uma nova instância do serviço de embeddings
   * @param llmManager Gerenciador de LLM para gerar embeddings
   */
  constructor(private llmManager: LLMManager) {}

  /**
   * Gera embedding para um item usando o modelo nomic-embed-text
   * @param content Texto para o qual se deseja gerar o embedding
   * @returns Promessa que resolve para um vetor de números representando o embedding
   */
  async generateEmbedding(content: string): Promise<number[]> {
    console.log('🔢 Generating embedding for content:', content.substring(0, 100) + '...');
    
    const provider = await this.llmManager.getAvailableProvider();
    if (!provider) {
      throw new Error('No LLM provider available for embedding generation');
    }

    try {
      // Usar o modelo nomic-embed-text para gerar embedding
      const embeddings = await provider.generateEmbeddings([content], 'nomic-embed-text');
      
      if (embeddings && embeddings.length > 0) {
        const embedding = this.normalizeEmbeddingSize(embeddings[0]);
        console.log(`✅ Generated embedding with ${embedding.length} dimensions using nomic-embed-text model`);
        return embedding;
      } else {
        throw new Error('Failed to generate embedding with nomic-embed-text');
      }
    } catch (error) {
      console.error('❌ Failed to generate embedding:', error);
      // Fallback: gerar embedding baseado em hash do conteúdo
      return this.generateFallbackEmbedding(content);
    }
  }

  /**
   * Gera embeddings para múltiplos itens usando processamento em lote com nomic-embed-text
   * @param items Array de textos para os quais se deseja gerar embeddings
   * @returns Promessa que resolve para um array de itens de embedding
   */
  async generateEmbeddings(items: string[]): Promise<EmbeddingItem[]> {
    console.log(`🔢 Generating embeddings for ${items.length} items using nomic-embed-text model`);
    
    const embeddingItems: EmbeddingItem[] = [];
    const provider = await this.llmManager.getAvailableProvider();
    
    if (!provider) {
      throw new Error('No LLM provider available for embedding generation');
    }
    
    try {
      // Processamento em lote para todos os itens de uma vez
      const embeddings = await provider.generateEmbeddings(items, 'nomic-embed-text');
      
      // Criar objetos de embedding para cada item
      for (let i = 0; i < items.length; i++) {
        if (embeddings[i]) {
          embeddingItems.push({
            id: `item_${i}`,
            content: items[i],
            embedding: this.normalizeEmbeddingSize(embeddings[i]),
            contextSources: []
          });
        } else {
          // Fallback para itens que falharam no processamento em lote
          try {
            const fallbackEmbedding = await this.generateFallbackEmbedding(items[i]);
            embeddingItems.push({
              id: `item_${i}`,
              content: items[i],
              embedding: fallbackEmbedding,
              contextSources: []
            });
          } catch (error) {
            console.error(`❌ Failed to generate fallback embedding for item ${i}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to generate embeddings in batch:', error);
      
      // Fallback para processamento individual se o processamento em lote falhar
      for (let i = 0; i < items.length; i++) {
        try {
          const fallbackEmbedding = await this.generateFallbackEmbedding(items[i]);
          embeddingItems.push({
            id: `item_${i}`,
            content: items[i],
            embedding: fallbackEmbedding,
            contextSources: []
          });
        } catch (innerError) {
          console.error(`❌ Failed to generate fallback embedding for item ${i}:`, innerError);
        }
      }
    }
    
    console.log(`✅ Generated ${embeddingItems.length} embeddings successfully`);
    return embeddingItems;
  }

  /**
   * Normaliza um vetor de embedding para ter exatamente 128 dimensões
   * @param embedding Vetor de embedding original
   * @returns Vetor de embedding normalizado com 128 dimensões
   */
  private normalizeEmbeddingSize(embedding: number[]): number[] {
    // Garantir que temos exatamente 128 dimensões
    if (embedding.length === 128) {
      return embedding;
    } else if (embedding.length > 128) {
      return embedding.slice(0, 128);
    } else {
      // Preencher com zeros se necessário
      const padded = [...embedding];
      while (padded.length < 128) {
        padded.push(0);
      }
      return padded;
    }
  }

  /**
   * Gera embedding de fallback baseado em características do texto
   * @param content Texto para o qual se deseja gerar embedding de fallback
   * @returns Array de números representando o embedding
   */
  private generateFallbackEmbedding(content: string): number[] {
    console.log('🔄 Generating fallback embedding');
    
    const embedding = new Array(128).fill(0);
    const words = content.toLowerCase().split(/\s+/);
    
    // Características básicas do texto
    embedding[0] = Math.min(content.length / 1000, 1); // Tamanho relativo
    embedding[1] = words.length / 100; // Número de palavras
    embedding[2] = (content.match(/[?]/g) || []).length / 10; // Interrogações
    embedding[3] = (content.match(/[!]/g) || []).length / 10; // Exclamações
    embedding[4] = (content.match(/[A-Z]/g) || []).length / content.length; // Maiúsculas
    
    // Hash-based features para as outras dimensões
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    for (let i = 5; i < 128; i++) {
      hash = ((hash * 1103515245) + 12345) & 0x7fffffff;
      embedding[i] = (hash / 0x7fffffff) * 2 - 1; // Normalizar entre -1 e 1
    }
    
    return embedding;
  }

  /**
   * Calcula similaridade coseno entre dois embeddings
   * @param embedding1 Primeiro vetor de embedding
   * @param embedding2 Segundo vetor de embedding
   * @returns Valor de similaridade entre 0 (nenhuma) e 1 (idênticos)
   */
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
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
