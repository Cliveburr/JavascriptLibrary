import { MessageDecomposition, EnrichedDecomposition, LLMProvider } from '../interfaces/llm.interface';
import { LLMManager } from './llm.service';
import { ContextEnrichmentService } from './context-enrichment.service';
import { EmbeddingService } from './embedding.service';
import { VectorStorageService } from './vector-storage.service';
import { QdrantProvider } from '../providers/qdrant.provider';

export class MessageDecomposer {
  private contextEnrichmentService: ContextEnrichmentService;

  constructor(
    private llmManager: LLMManager
  ) {
    // Inicializar serviços de enriquecimento de contexto
    const embeddingService = new EmbeddingService(this.llmManager);
    const qdrantProvider = new QdrantProvider(); // Usar configuração padrão
    const vectorStorageService = new VectorStorageService(qdrantProvider);
    this.contextEnrichmentService = new ContextEnrichmentService(embeddingService, vectorStorageService);
  }
  
  /**
   * Decompõe uma mensagem do usuário em intenções, contextos e ações usando LLM
   */
  public async decomposeMessage(message: string): Promise<MessageDecomposition> {
    console.log('🧠 Starting LLM decomposition for message:', message.substring(0, 100) + '...');
    
    const provider = await this.llmManager.getAvailableProvider();
    if (!provider) {
      throw new Error('No LLM provider available');
    }

    const prompt = this.buildDecompositionPrompt(message);
    console.log('📝 Generated prompt for LLM');
    
    try {
      console.log('⏳ Calling LLM...');
      const llmResponse = await Promise.race([
        provider.generateSingleResponse(prompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('LLM timeout after 1 minute')), 60000)
        )
      ]);
      
      console.log('✅ LLM response received:', llmResponse.substring(0, 200) + '...');
      
      // Tentar extrair JSON da resposta do LLM
      const jsonMatch = llmResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        console.log('📋 JSON array found in response');
        const parsedResponse = JSON.parse(jsonMatch[0]);
        const items = this.processLLMResponse(parsedResponse);
        console.log(`🎯 Successfully processed ${items.length} items from LLM`);
        
        return {
          originalMessage: message,
          decomposedItems: items,
          timestamp: new Date().toISOString(),
          totalItems: items.length
        };
      } else {
        throw new Error('No valid JSON array found in LLM response');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse LLM response:', parseError);
      throw new Error(`LLM decomposition failed: ${parseError}`);
    }
  }

  /**
   * Constrói o prompt para o LLM decompor a mensagem
   */
  private buildDecompositionPrompt(message: string): string {
    return `Você é um agente que deve decompor uma mensagem em itens independentes para posterior processamento.

INSTRUÇÕES:
- Para cada item, isole uma ação clara (verbo + alvo).
- Separe informações contextuais relevantes como itens separados, quando necessário.
- Não repita partes entre itens.
- Mantenha os itens autônomos e claros para serem executados individualmente.

IMPORTANTE:
Os exemplos abaixo são apenas ilustrações. A mensagem real vem depois.

EXEMPLO:
Entrada: "agende para desligar as luzes daqui 10min"  
Saída:
[
  "agendar ação para 10 minutos no futuro",
  "executar ação: desligar luzes"
]
---
Entrada: "qual é a url da company X na develop?"  
Saída:
[
  "buscar url",
  "contexto: company X no ambiente develop"
]
---
Entrada: "gere um gráfico dos acessos semanais e envie no meu email"  
Saída:
[
  "gerar gráfico de acessos semanais",
  "enviar gráfico por email"
]
--- fim dos exemplos ---

Agora analise a MENSAGEM REAL abaixo:

MENSAGEM:
"""${message}"""

OUTPUT: Retorne apenas uma lista JSON de strings:
["item1", "item2", "item3"]

JSON:`;
  }

  /**
   * Processa a resposta do LLM e converte para string[]
   */
  private processLLMResponse(llmResponse: any): string[] {
    console.log('🔍 Processing LLM response:', JSON.stringify(llmResponse, null, 2));
    const items: string[] = [];
    
    if (Array.isArray(llmResponse)) {
      console.log(`📝 Found ${llmResponse.length} items in response array`);
      llmResponse.forEach((content: any, index: number) => {
        console.log(`Processing item ${index}:`, content);
        if (typeof content === 'string' && content.trim().length > 0) {
          const cleanContent = content.trim();
          items.push(cleanContent);
        } else {
          console.log(`⚠️ Skipping invalid item ${index}: not a valid string`);
        }
      });
    } else {
      console.log('❌ Response is not an array');
      // Tentativa de fallback para formato antigo ou outros formatos
      if (llmResponse.items && Array.isArray(llmResponse.items)) {
        console.log('🔄 Attempting fallback to old format...');
        llmResponse.items.forEach((item: any, index: number) => {
          if (item.content && typeof item.content === 'string') {
            items.push(item.content.trim());
          }
        });
      } else if (typeof llmResponse === 'string') {
        console.log('🔄 Attempting to process single string...');
        items.push(llmResponse.trim());
      }
    }
    
    console.log(`✅ Processed ${items.length} valid items`);
    return items;
  }

  /**
   * Pipeline completo: Decompõe mensagem e enriquece com contexto vetorial
   */
  public async decomposeAndEnrichMessage(message: string): Promise<EnrichedDecomposition> {
    console.log('🧠 Starting complete pipeline: decomposition + context enrichment');
    
    // Etapa 1: Decomposição da mensagem
    const decomposition = await this.decomposeMessage(message);
    console.log(`✅ Decomposition completed with ${decomposition.decomposedItems.length} items`);
    
    // Etapa 2: Enriquecimento com embeddings e busca vetorial
    console.log('🔮 Starting context enrichment...');
    const enrichedDecomposition = await this.contextEnrichmentService.enrichDecomposition(decomposition);
    console.log(`✅ Context enrichment completed with ${enrichedDecomposition.enrichedItems.length} enriched items`);
    
    // Log do resultado final
    this.logEnrichmentResults(enrichedDecomposition);
    
    return enrichedDecomposition;
  }

  /**
   * Busca contexto para um texto específico
   */
  public async searchContextForText(text: string, limit: number = 5): Promise<any[]> {
    return await this.contextEnrichmentService.searchContextForText(text, limit);
  }

  /**
   * Obtém estatísticas do cache de embeddings
   */
  public getCacheStats(): { size: number; items: string[] } {
    return this.contextEnrichmentService.getCacheStats();
  }

  /**
   * Limpa o cache de embeddings
   */
  public clearCache(): void {
    this.contextEnrichmentService.clearCache();
  }

  /**
   * Log detalhado dos resultados do enriquecimento
   */
  private logEnrichmentResults(enrichedDecomposition: EnrichedDecomposition): void {
    console.log('\n📊 ENRICHMENT RESULTS:');
    console.log(`Original message: ${enrichedDecomposition.originalMessage}`);
    console.log(`Total items: ${enrichedDecomposition.enrichedItems.length}`);
    
    enrichedDecomposition.enrichedItems.forEach((enrichedItem, index) => {
      console.log(`\n--- Item ${index + 1} ---`);
      console.log(`Content: ${enrichedItem.item}`);
      console.log(`Embedding dimensions: ${enrichedItem.embedding.length}`);
      console.log(`Related context sources: ${enrichedItem.relatedContext.length}`);
      
      if (enrichedItem.relatedContext.length > 0) {
        console.log('Context sources:');
        enrichedItem.relatedContext.forEach((context, ctxIndex) => {
          console.log(`  ${ctxIndex + 1}. [Score: ${context.score?.toFixed(3)}] ${context.content.substring(0, 100)}...`);
        });
      }
    });
    console.log('\n');
  }
}
