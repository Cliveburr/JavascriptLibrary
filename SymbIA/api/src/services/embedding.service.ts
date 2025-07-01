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
   * Gera embedding para um item usando o modelo LLM local
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
      // Usar o LLM para gerar uma representação numérica do texto
      // Este é um approach simplificado - normalmente usaríamos modelos específicos para embeddings
      const embeddingPrompt = this.buildEmbeddingPrompt(content);
      
      const response = await provider.generateSingleResponse(embeddingPrompt);
      
      // Extrair o array de números da resposta
      const embedding = this.parseEmbeddingResponse(response);
      
      console.log(`✅ Generated embedding with ${embedding.length} dimensions`);
      return embedding;
    } catch (error) {
      console.error('❌ Failed to generate embedding:', error);
      // Fallback: gerar embedding baseado em hash do conteúdo
      return this.generateFallbackEmbedding(content);
    }
  }

  /**
   * Gera embeddings para múltiplos itens
   * @param items Array de textos para os quais se deseja gerar embeddings
   * @returns Promessa que resolve para um array de itens de embedding
   */
  async generateEmbeddings(items: string[]): Promise<EmbeddingItem[]> {
    console.log(`🔢 Generating embeddings for ${items.length} items`);
    
    const embeddingItems: EmbeddingItem[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      try {
        const embedding = await this.generateEmbedding(item);
        embeddingItems.push({
          id: `item_${i}`,
          content: item,
          embedding: embedding,
          contextSources: []
        });
      } catch (error) {
        console.error(`❌ Failed to generate embedding for item ${i}:`, error);
        // Continuar com os próximos itens mesmo se um falhar
      }
    }
    
    console.log(`✅ Generated ${embeddingItems.length} embeddings successfully`);
    return embeddingItems;
  }

  /**
   * Constrói o prompt para gerar embedding usando LLM
   * @param content Texto para o qual se deseja gerar embedding
   * @returns Prompt formatado para enviar ao LLM
   */
  private buildEmbeddingPrompt(content: string): string {
    return `Você é um sistema que converte texto em representação numérica (embedding).

INSTRUÇÕES:
- Analise o texto fornecido semanticamente
- Gere exatamente 128 números decimais entre -1 e 1
- Cada número deve representar uma dimensão semântica do texto
- Retorne apenas o array JSON de números, sem explicações

TEXTO:
"""${content}"""

EMBEDDING (array de 128 números):`;
  }

  /**
   * Extrai o array de embedding da resposta do LLM
   * @param response Resposta do LLM contendo o embedding em formato JSON
   * @returns Array de números representando o embedding
   */
  private parseEmbeddingResponse(response: string): number[] {
    try {
      // Tentar encontrar array JSON na resposta
      const jsonMatch = response.match(/\[[\d\s.,-]+\]/);
      if (jsonMatch) {
        const embedding = JSON.parse(jsonMatch[0]);
        if (Array.isArray(embedding) && embedding.every(n => typeof n === 'number')) {
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
      }
      throw new Error('No valid embedding array found in response');
    } catch (error) {
      console.warn('⚠️ Failed to parse embedding from LLM response, using fallback');
      return this.generateFallbackEmbedding(response);
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
