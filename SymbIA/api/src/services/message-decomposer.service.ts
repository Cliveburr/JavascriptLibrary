import { MessageDecomposition, EnrichedDecomposition, LLMProvider, ExecutionPlan } from '../interfaces/llm.interface';
import { LLMManager } from './llm.service';
import { ContextEnrichmentService } from './context-enrichment.service';
import { EmbeddingService } from './embedding.service';
import { VectorStorageService } from './vector-storage.service';
import { QdrantProvider } from '../providers/qdrant.provider';
import { ExecutionPlannerService } from './execution-planner.service';

/**
 * Serviço principal para decomposição e processamento de mensagens do usuário
 */
export class MessageDecomposer {
  /**
   * Serviço para enriquecimento de contexto com embeddings vetoriais
   */
  private contextEnrichmentService: ContextEnrichmentService;
  
  /**
   * Serviço para planejamento de execução baseado nas decomposições
   */
  private executionPlannerService: ExecutionPlannerService;

  /**
   * Cria uma nova instância do decompositor de mensagens
   * @param llmManager Gerenciador de LLM para processamento de texto
   */
  constructor(
    private llmManager: LLMManager
  ) {
    // Inicializar serviços de enriquecimento de contexto
    const embeddingService = new EmbeddingService(this.llmManager);
    const qdrantProvider = new QdrantProvider(); // Usar configuração padrão
    const vectorStorageService = new VectorStorageService(qdrantProvider);
    this.contextEnrichmentService = new ContextEnrichmentService(embeddingService, vectorStorageService);
    
    // Inicializar serviço de planejamento de execução
    this.executionPlannerService = new ExecutionPlannerService(this.llmManager);
  }
  
  /**
   * Decompõe uma mensagem do usuário em intenções, contextos e ações usando LLM
   * @param message Mensagem do usuário a ser decomposta
   * @returns Promessa que resolve para a decomposição estruturada da mensagem
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
   * @param message Mensagem do usuário a ser decomposta
   * @returns Prompt formatado para enviar ao LLM
   */
  private buildDecompositionPrompt(message: string): string {
    return `Você é um agente que deve decompor uma mensagem em itens independentes para processamento automático.

INSTRUÇÕES:
- Cada item deve representar uma ação ou um contexto específico.
- Itens devem ser claros, objetivos e autônomos.
- Use frases curtas com verbo no infinitivo ou estrutura direta de comando.
- Não repita trechos entre itens.
- Formato estritamente em JSON.

EXEMPLOS (ilustrativos, não relacionados à mensagem real):

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
---
Entrada: "salve o numero 1234 para sempre que eu quizer chamar o jozelito"  
Saída:
[
  "salvar o numero 1234 para chamar o jozelito"
]
--- fim dos exemplos ---

Agora analise a seguinte MENSAGEM REAL:

"""${message}"""

FORMATO ESTRITO:
Retorne apenas a lista JSON de strings, iniciando com \`[\` e sem nenhuma explicação.

JSON:
[`;
  }

  /**
   * Processa a resposta do LLM e converte para string[]
   * @param llmResponse Resposta do LLM contendo os itens decompostos
   * @returns Array de strings com os itens decompostos
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
   * @param message Mensagem do usuário a ser processada
   * @returns Promessa que resolve para a decomposição enriquecida com contexto
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
   * Pipeline completo até etapa 4: Decomposição, enriquecimento e planejamento de execução
   * @param message Mensagem do usuário a ser processada
   * @returns Promessa que resolve para um objeto contendo a decomposição enriquecida e o plano de execução
   */
  public async decomposeEnrichAndPlan(message: string): Promise<{
    enrichedDecomposition: EnrichedDecomposition;
    executionPlan: ExecutionPlan;
  }> {
    console.log('🧠 Starting complete pipeline including execution planning');
    
    // Etapa 1-2: Decomposição da mensagem e enriquecimento com contexto
    const enrichedDecomposition = await this.decomposeAndEnrichMessage(message);
    console.log(`✅ Decomposition and enrichment completed with ${enrichedDecomposition.enrichedItems.length} items`);
    
    // Etapa 3: Criar plano de execução
    console.log('📋 Starting execution planning...');
    const executionPlan = await this.executionPlannerService.createExecutionPlan(enrichedDecomposition);
    console.log(`✅ Execution planning completed with ${executionPlan.actions.length} actions`);
    
    // Log do resultado final
    this.logExecutionPlan(executionPlan);
    
    return {
      enrichedDecomposition,
      executionPlan
    };
  }
  
  /**
   * Busca contexto para um texto específico
   * @param text Texto para o qual se deseja buscar contexto
   * @param limit Número máximo de resultados a retornar
   * @returns Promessa que resolve para um array de fontes de contexto relacionadas
   */
  public async searchContextForText(text: string, limit: number = 5): Promise<any[]> {
    return await this.contextEnrichmentService.searchContextForText(text, limit);
  }

  /**
   * Obtém estatísticas do cache de embeddings
   * @returns Objeto com tamanho do cache e lista de IDs armazenados
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
   * @param enrichedDecomposition Decomposição enriquecida a ser logada
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
  
  /**
   * Log detalhado do plano de execução
   * @param executionPlan Plano de execução a ser logado
   */
  private logExecutionPlan(executionPlan: ExecutionPlan): void {
    console.log('\n📊 EXECUTION PLAN:');
    console.log(`Original message: ${executionPlan.originalMessage}`);
    console.log(`Total actions: ${executionPlan.actions.length}`);
    console.log(`Timestamp: ${executionPlan.timestamp}`);
    
    executionPlan.actions.forEach((action) => {
      console.log(`\n--- Step ${action.stepNumber} ---`);
      console.log(`Action: ${action.actionName}`);
      console.log(`Description: ${action.actionDescription}`);
      console.log(`Related to item: ${action.itemIndex}`);
      console.log(`Justification: ${action.justification}`);
      console.log(`Status: ${action.status}`);
    });
    console.log('\n');
  }
}
