import { ExecutionPlan, ExecutionPlanAction, EnrichedDecomposition, LLMProvider } from '../interfaces/llm.interface';
import { LLMManager } from './llm.service';

/**
 * Serviço responsável por criar planos de execução para mensagens decompostas
 */
export class ExecutionPlannerService {
  /**
   * Cria uma nova instância do serviço de planejamento de execução
   * @param llmManager Gerenciador de LLM para geração de planos
   */
  constructor(
    private llmManager: LLMManager
  ) {}
  
  /**
   * Cria um plano de execução a partir de uma decomposição enriquecida
   * @param enrichedDecomposition Decomposição enriquecida com contexto
   * @returns Promessa que resolve para um plano de execução
   */
  public async createExecutionPlan(enrichedDecomposition: EnrichedDecomposition): Promise<ExecutionPlan> {
    console.log('🧩 Starting execution plan creation');
    
    const provider = await this.llmManager.getAvailableProvider();
    if (!provider) {
      throw new Error('No LLM provider available');
    }

    try {
      // Construir o prompt para o LLM criar o plano de execução
      const prompt = this.buildExecutionPlanPrompt(enrichedDecomposition);
      console.log('📝 Generated prompt for planning');
      
      console.log('⏳ Calling LLM to generate execution plan...');
      const llmResponse = await Promise.race([
        provider.generateSingleResponse(prompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('LLM timeout after 1 minute')), 60000)
        )
      ]);
      
      console.log('✅ LLM plan response received');
      
      // Extrair o JSON da resposta do LLM
      const jsonMatch = llmResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        console.log('📋 JSON array found in planning response');
        const parsedActions = JSON.parse(jsonMatch[0]);
        const actions = this.processLLMPlanResponse(parsedActions, enrichedDecomposition);
        console.log(`🎯 Successfully processed ${actions.length} plan actions from LLM`);
        
        return {
          originalMessage: enrichedDecomposition.originalMessage,
          decomposition: {
            originalMessage: enrichedDecomposition.originalMessage,
            decomposedItems: enrichedDecomposition.decomposedItems,
            timestamp: enrichedDecomposition.timestamp,
            totalItems: enrichedDecomposition.decomposedItems.length
          },
          enrichedDecomposition: enrichedDecomposition,
          actions: actions,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('No valid JSON array found in LLM planning response');
      }
    } catch (error) {
      console.error('❌ Failed to create execution plan:', error);
      
      // Criando um plano de fallback sequencial
      console.log('⚠️ Creating fallback sequential plan');
      const fallbackActions = this.createFallbackSequentialPlan(enrichedDecomposition);
      
      return {
        originalMessage: enrichedDecomposition.originalMessage,
        decomposition: {
          originalMessage: enrichedDecomposition.originalMessage,
          decomposedItems: enrichedDecomposition.decomposedItems,
          timestamp: enrichedDecomposition.timestamp,
          totalItems: enrichedDecomposition.decomposedItems.length
        },
        enrichedDecomposition: enrichedDecomposition,
        actions: fallbackActions,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Constrói o prompt para o LLM criar um plano de execução
   * @param enrichedDecomposition Decomposição enriquecida com contexto
   * @returns Prompt formatado para enviar ao LLM
   */
  private buildExecutionPlanPrompt(enrichedDecomposition: EnrichedDecomposition): string {
    // Preparar itens decompostos com contexto
    const itemsWithContext = enrichedDecomposition.enrichedItems.map((item, index) => {
      // Condensar o contexto relacionado para cada item
      const contextSummary = item.relatedContext.length > 0 
        ? item.relatedContext.map(ctx => 
            `- (Score: ${ctx.score.toFixed(2)}) ${ctx.content.substring(0, 150)}...`
          ).join('\n')
        : 'Sem contexto adicional encontrado';
      
      return `ITEM ${index + 1}: "${item.item}"\nCONTEXTO RELACIONADO:\n${contextSummary}\n`;
    }).join('\n---\n');

    return `Você é um agente de planejamento que deve criar um plano de execução estruturado com base em uma mensagem do usuário que foi decomposta em itens e enriquecida com contexto.

TAREFA:
Analisar os itens decompostos e seu contexto relacionado, e criar um plano de execução ordenado e lógico.

ENTRADA:
Mensagem original: "${enrichedDecomposition.originalMessage}"

Itens decompostos com contexto:
${itemsWithContext}

SAÍDA ESPERADA:
Um array JSON de ações a serem executadas, cada uma com:
1. stepNumber: número do passo (começando em 1)
2. actionName: nome curto da ação
3. actionDescription: descrição detalhada do que deve ser feito
4. itemIndex: índice do item da decomposição (começando em 0) a que se refere
5. justification: justificativa da ordem dessa ação

IMPORTANTE:
- Organize as ações na ordem mais lógica, considerando dependências e eficiência
- Cada ação deve estar claramente relacionada a pelo menos um dos itens decompostos
- Justifique a ordem de cada ação
- Mantenha o plano conciso, unindo ações similares quando possível

EXEMPLO DE SAÍDA:
[
  {
    "stepNumber": 1,
    "actionName": "Verificar disponibilidade da API",
    "actionDescription": "Consultar status da API de clima para garantir que está operacional",
    "itemIndex": 0,
    "justification": "Verificação preliminar necessária antes de fazer qualquer consulta"
  },
  {
    "stepNumber": 2,
    "actionName": "Obter dados de previsão",
    "actionDescription": "Buscar previsão do tempo para São Paulo nos próximos 3 dias",
    "itemIndex": 1,
    "justification": "Precisa ser executado após confirmação de disponibilidade da API"
  }
]

PLANO DE EXECUÇÃO:
`;
  }

  /**
   * Processa a resposta do LLM para o plano de execução
   * @param llmResponse Resposta do LLM contendo as ações do plano
   * @param enrichedDecomposition Decomposição enriquecida com contexto
   * @returns Array de ações do plano de execução
   */
  private processLLMPlanResponse(llmResponse: any, enrichedDecomposition: EnrichedDecomposition): ExecutionPlanAction[] {
    console.log('🔍 Processing LLM plan response');
    const actions: ExecutionPlanAction[] = [];
    
    if (Array.isArray(llmResponse)) {
      llmResponse.forEach((action: any, index: number) => {
        try {
          if (
            typeof action === 'object' &&
            'actionName' in action &&
            'actionDescription' in action
          ) {
            // Garantir que itemIndex está dentro dos limites válidos
            const itemIndex = 'itemIndex' in action && 
              Number.isInteger(action.itemIndex) && 
              action.itemIndex >= 0 && 
              action.itemIndex < enrichedDecomposition.decomposedItems.length
              ? action.itemIndex
              : 0;
              
            // Garantir que stepNumber é sequencial
            const stepNumber = 'stepNumber' in action && Number.isInteger(action.stepNumber)
              ? action.stepNumber
              : index + 1;
              
            actions.push({
              stepNumber: stepNumber,
              actionName: action.actionName,
              actionDescription: action.actionDescription,
              itemIndex: itemIndex,
              justification: action.justification || 'Sem justificativa fornecida',
              status: 'pending'
            });
          }
        } catch (e) {
          console.warn(`⚠️ Skipping invalid action at index ${index}:`, e);
        }
      });
      
      // Ordenar ações por stepNumber
      actions.sort((a, b) => a.stepNumber - b.stepNumber);
      
      // Re-numerar steps para garantir sequência contígua
      actions.forEach((action, index) => {
        action.stepNumber = index + 1;
      });
    }
    
    // Se nenhuma ação válida foi processada, criar plano fallback
    if (actions.length === 0) {
      console.warn('⚠️ No valid actions found in LLM response, using fallback plan');
      return this.createFallbackSequentialPlan(enrichedDecomposition);
    }
    
    return actions;
  }
  
  /**
   * Cria um plano sequencial simples como fallback
   * @param enrichedDecomposition Decomposição enriquecida com contexto
   * @returns Array de ações do plano de execução
   */
  private createFallbackSequentialPlan(enrichedDecomposition: EnrichedDecomposition): ExecutionPlanAction[] {
    console.log('📝 Creating fallback sequential plan');
    const actions: ExecutionPlanAction[] = [];
    
    enrichedDecomposition.decomposedItems.forEach((item, index) => {
      actions.push({
        stepNumber: index + 1,
        actionName: `Executar item ${index + 1}`,
        actionDescription: item,
        itemIndex: index,
        justification: 'Ordem sequencial baseada na decomposição original',
        status: 'pending'
      });
    });
    
    return actions;
  }
}
