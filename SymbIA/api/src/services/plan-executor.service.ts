import { 
  ExecutionPlan, 
  ExecutionPlanAction, 
  ExecutionResult, 
  ExecutionSummary, 
  ExecutionReport, 
  ReplanningRequest,
  LLMProvider 
} from '../interfaces/llm.interface';
import { LLMManager } from './llm.service';

/**
 * Service responsible for executing execution plans step by step
 */
export class PlanExecutorService {
  /**
   * Creates a new instance of the plan execution service
   * @param llmManager LLM manager for response generation
   */
  constructor(
    private llmManager: LLMManager
  ) {}

  /**
   * Executes a complete execution plan
   * @param plan Execution plan to be executed
   * @returns Complete execution report
   */
  public async executePlan(plan: ExecutionPlan): Promise<ExecutionReport> {
    console.log('🎯 Starting plan execution');
    const startTime = new Date().toISOString();
    const stepResults: ExecutionResult[] = [];
    let wasReplanned = false;
    let replanedPlan: ExecutionPlan | undefined;

    try {
      // Execute each step of the plan
      for (let i = 0; i < plan.actions.length; i++) {
        const action = plan.actions[i];
        console.log(`🔄 Executing step ${action.stepNumber}: ${action.actionName}`);

        // Update action status to "in_progress"
        action.status = 'in_progress';

        const stepResult = await this.executeStep(action, plan);
        stepResults.push(stepResult);

        // Update action status based on result
        action.status = stepResult.status === 'success' ? 'completed' : 'failed';

        // Evaluate if replanning is necessary
        const shouldReplan = await this.evaluateNeedForReplanning(stepResult, plan, stepResults);
        
        if (shouldReplan.needsReplanning) {
          console.log('🔄 Replanning required:', shouldReplan.reason);
          wasReplanned = true;
          
          try {
            replanedPlan = await this.performReplanning({
              originalPlan: plan,
              executedResults: stepResults,
              reason: shouldReplan.reason,
              additionalContext: shouldReplan.context
            });

            // Continue execution with the new plan
            const remainingSteps = replanedPlan.actions.slice(stepResults.length);
            for (const newAction of remainingSteps) {
              console.log(`🔄 Executing replanned step ${newAction.stepNumber}: ${newAction.actionName}`);
              newAction.status = 'in_progress';
              
              const newStepResult = await this.executeStep(newAction, replanedPlan);
              stepResults.push(newStepResult);
              
              newAction.status = newStepResult.status === 'success' ? 'completed' : 'failed';
            }
            break;
          } catch (replanError) {
            console.error('❌ Replanning failed:', replanError);
            stepResults.push({
              stepNumber: action.stepNumber + 0.5,
              actionName: 'Replanning',
              result: null,
              status: 'failed',
              message: 'Failed to perform replanning',
              executionTime: 0,
              timestamp: new Date().toISOString(),
              error: replanError instanceof Error ? replanError.message : 'Unknown replanning error'
            });
          }
        }

        // If step failed and replanning was not possible, continue with next step
        if (stepResult.status === 'failed' && !wasReplanned) {
          console.warn(`⚠️ Step ${action.stepNumber} failed, continuing with next step`);
        }
      }

      const endTime = new Date().toISOString();
      const summary = this.generateExecutionSummary(stepResults, plan);
      const finalResponse = await this.generateFinalResponse(plan, stepResults, summary);

      return {
        originalPlan: plan,
        stepResults,
        summary,
        finalResponse,
        wasReplanned,
        replanedPlan,
        startTime,
        endTime
      };

    } catch (error) {
      console.error('❌ Plan execution failed:', error);
      const endTime = new Date().toISOString();
      const summary = this.generateExecutionSummary(stepResults, plan);
      
      return {
        originalPlan: plan,
        stepResults,
        summary: {
          ...summary,
          errors: [...summary.errors, error instanceof Error ? error.message : 'Unknown execution error']
        },
        finalResponse: 'A execução do plano falhou devido a um erro interno. Verifique os logs para mais detalhes.',
        wasReplanned,
        replanedPlan,
        startTime,
        endTime
      };
    }
  }

  /**
   * Executes a single step of the plan
   * @param action Action to be executed
   * @param plan Complete plan for context
   * @returns Result of step execution
   */
  private async executeStep(action: ExecutionPlanAction, plan: ExecutionPlan): Promise<ExecutionResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      console.log(`⚡ Executing action: ${action.actionName}`);
      
      // Get LLM provider
      const provider = await this.llmManager.getAvailableProvider();
      if (!provider) {
        throw new Error('No LLM provider available');
      }

      // Build prompt for action execution
      const executionPrompt = this.buildExecutionPrompt(action, plan);
      
      // Execute action using LLM
      const result = await Promise.race([
        provider.generateSingleResponse(executionPrompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Step execution timeout after 2 minutes')), 120000)
        )
      ]);

      const executionTime = Date.now() - startTime;

      return {
        stepNumber: action.stepNumber,
        actionName: action.actionName,
        result: result,
        status: 'success',
        message: 'Step executed successfully',
        executionTime,
        timestamp
      };

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`❌ Step ${action.stepNumber} failed:`, errorMessage);

      return {
        stepNumber: action.stepNumber,
        actionName: action.actionName,
        result: null,
        status: 'failed',
        message: 'Step execution failed',
        executionTime,
        timestamp,
        error: errorMessage
      };
    }
  }

  /**
   * Constrói o prompt para execução de uma ação específica
   * @param action Ação a ser executada
   * @param plan Plano completo para contexto
   * @returns Prompt formatado para o LLM
   */
  private buildExecutionPrompt(action: ExecutionPlanAction, plan: ExecutionPlan): string {
    // Obter o item da decomposição relacionado a esta ação
    const relatedItem = plan.enrichedDecomposition?.decomposedItems[action.itemIndex] || 
                       plan.decomposition.decomposedItems[action.itemIndex] ||
                       'Item não encontrado';

    // Obter contexto relacionado se disponível
    const relatedContext = plan.enrichedDecomposition?.enrichedItems[action.itemIndex]?.relatedContext || [];
    const contextSummary = relatedContext.length > 0 
      ? relatedContext.map(ctx => `- ${ctx.content.substring(0, 200)}...`).join('\n')
      : 'Nenhum contexto adicional disponível';

    return `Você é um agente executor que precisa realizar uma ação específica baseada em um plano estruturado.

CONTEXTO DO PLANO:
Mensagem original do usuário: "${plan.originalMessage}"

AÇÃO A EXECUTAR:
Passo ${action.stepNumber}: ${action.actionName}
Descrição: ${action.actionDescription}
Justificativa: ${action.justification}

ITEM RELACIONADO DA DECOMPOSIÇÃO:
"${relatedItem}"

CONTEXTO ADICIONAL RELEVANTE:
${contextSummary}

INSTRUÇÕES:
1. Execute a ação descrita de forma precisa e completa
2. Forneça informações detalhadas sobre o que foi realizado
3. Se não for possível executar a ação completamente, explique as limitações
4. Mantenha o foco no item específico da decomposição
5. Use o contexto adicional para enriquecer sua resposta

IMPORTANTE:
- Seja específico e prático na execução
- Forneça resultados concretos sempre que possível
- Se a ação envolve busca de informações, seja detalhado nos resultados
- Se a ação envolve análise, forneça insights claros

EXECUÇÃO DA AÇÃO:
`;
  }

  /**
   * Avalia se é necessário replanejamento baseado no resultado de um passo
   * @param stepResult Resultado do passo executado
   * @param plan Plano original
   * @param allResults Todos os resultados executados até agora
   * @returns Objeto indicando se precisa replanejar e o motivo
   */
  private async evaluateNeedForReplanning(
    stepResult: ExecutionResult, 
    plan: ExecutionPlan, 
    allResults: ExecutionResult[]
  ): Promise<{ needsReplanning: boolean; reason: string; context: string }> {
    
    // Critérios para replanejamento:
    
    // 1. Se o passo falhou criticamente
    if (stepResult.status === 'failed' && stepResult.error?.includes('critical')) {
      return {
        needsReplanning: true,
        reason: 'Critical step failure requires plan adjustment',
        context: `Step ${stepResult.stepNumber} failed critically: ${stepResult.error}`
      };
    }

    // 2. Se muitos passos falharam consecutivamente
    const recentFailures = allResults.slice(-3).filter(r => r.status === 'failed').length;
    if (recentFailures >= 2) {
      return {
        needsReplanning: true,
        reason: 'Multiple consecutive failures indicate need for strategy change',
        context: `Last ${recentFailures} steps failed, current approach may not be working`
      };
    }

    // 3. Se o resultado indica mudança de contexto ou necessidades
    if (stepResult.result && typeof stepResult.result === 'string') {
      const resultText = stepResult.result.toLowerCase();
      if (resultText.includes('não é possível') || 
          resultText.includes('indisponível') ||
          resultText.includes('erro') ||
          resultText.includes('falha')) {
        return {
          needsReplanning: true,
          reason: 'Step result indicates context change requiring plan adjustment',
          context: `Step result suggests constraints: ${stepResult.result.substring(0, 200)}`
        };
      }
    }

    return {
      needsReplanning: false,
      reason: '',
      context: ''
    };
  }

  /**
   * Realiza o replanejamento baseado nos resultados executados
   * @param request Dados para o replanejamento
   * @returns Novo plano de execução
   */
  private async performReplanning(request: ReplanningRequest): Promise<ExecutionPlan> {
    console.log('🔄 Starting replanning process');
    
    try {
      const provider = await this.llmManager.getAvailableProvider();
      if (!provider) {
        throw new Error('No LLM provider available for replanning');
      }

      // Construir prompt para replanejamento
      const replanPrompt = this.buildReplanningPrompt(request);
      
      // Gerar novo plano
      const replanResponse = await Promise.race([
        provider.generateSingleResponse(replanPrompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Replanning timeout after 1 minute')), 60000)
        )
      ]);

      // Processar resposta do replanejamento
      const newPlan = this.processReplanningResponse(replanResponse, request);
      
      console.log('✅ Replanning completed successfully');
      return newPlan;

    } catch (error) {
      console.error('❌ Replanning failed:', error);
      throw new Error(`Replanning failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Constrói o prompt para replanejamento
   * @param request Dados do replanejamento
   * @returns Prompt formatado
   */
  private buildReplanningPrompt(request: ReplanningRequest): string {
    const executedSummary = request.executedResults.map(result => 
      `Passo ${result.stepNumber}: ${result.actionName} - Status: ${result.status}${result.error ? ` (Erro: ${result.error})` : ''}`
    ).join('\n');

    return `Você é um agente de replanejamento que precisa ajustar um plano de execução baseado em resultados parciais.

SITUAÇÃO ATUAL:
Mensagem original: "${request.originalPlan.originalMessage}"
Motivo do replanejamento: ${request.reason}
Contexto adicional: ${request.additionalContext}

PLANO ORIGINAL:
${request.originalPlan.actions.map(a => `${a.stepNumber}. ${a.actionName}: ${a.actionDescription}`).join('\n')}

RESULTADOS EXECUTADOS:
${executedSummary}

TAREFAS:
1. Analise os resultados executados e identifique o que funcionou e o que não funcionou
2. Considere os passos restantes do plano original
3. Crie um novo plano que continue a partir do ponto atual
4. Ajuste a estratégia baseada nos aprendizados dos passos executados

SAÍDA ESPERADA:
Um array JSON com as ações restantes/ajustadas:
[
  {
    "stepNumber": [número sequencial],
    "actionName": "[nome da ação]",
    "actionDescription": "[descrição detalhada]",
    "itemIndex": [índice do item relacionado],
    "justification": "[justificativa considerando os resultados anteriores]"
  }
]

NOVO PLANO:
`;
  }

  /**
   * Processa a resposta do replanejamento
   * @param response Resposta do LLM
   * @param request Dados originais do replanejamento
   * @returns Novo plano de execução
   */
  private processReplanningResponse(response: string, request: ReplanningRequest): ExecutionPlan {
    try {
      // Extrair JSON da resposta
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in replanning response');
      }

      const newActions = JSON.parse(jsonMatch[0]);
      const processedActions: ExecutionPlanAction[] = [];

      // Processar as novas ações
      if (Array.isArray(newActions)) {
        newActions.forEach((action: any, index: number) => {
          processedActions.push({
            stepNumber: action.stepNumber || (request.executedResults.length + index + 1),
            actionName: action.actionName || `Replanned Action ${index + 1}`,
            actionDescription: action.actionDescription || 'Replanned action without description',
            itemIndex: action.itemIndex || 0,
            justification: action.justification || 'Generated during replanning',
            status: 'pending'
          });
        });
      }

      // Criar o novo plano
      return {
        originalMessage: request.originalPlan.originalMessage,
        decomposition: request.originalPlan.decomposition,
        enrichedDecomposition: request.originalPlan.enrichedDecomposition,
        actions: processedActions,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Failed to process replanning response:', error);
      
      // Criar plano de fallback
      const fallbackActions: ExecutionPlanAction[] = [{
        stepNumber: request.executedResults.length + 1,
        actionName: 'Continue with original plan',
        actionDescription: 'Continue execution with remaining steps from original plan',
        itemIndex: 0,
        justification: 'Fallback action due to replanning failure',
        status: 'pending'
      }];

      return {
        originalMessage: request.originalPlan.originalMessage,
        decomposition: request.originalPlan.decomposition,
        enrichedDecomposition: request.originalPlan.enrichedDecomposition,
        actions: fallbackActions,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Gera resumo da execução
   * @param stepResults Resultados de todos os passos
   * @param plan Plano original
   * @returns Resumo da execução
   */
  private generateExecutionSummary(stepResults: ExecutionResult[], plan: ExecutionPlan): ExecutionSummary {
    const totalSteps = stepResults.length;
    const successfulSteps = stepResults.filter(r => r.status === 'success').length;
    const failedSteps = stepResults.filter(r => r.status === 'failed').length;
    const skippedSteps = stepResults.filter(r => r.status === 'skipped').length;
    const totalExecutionTime = stepResults.reduce((sum, r) => sum + r.executionTime, 0);

    const actionsExecuted = stepResults
      .filter(r => r.status === 'success')
      .map(r => r.actionName);

    const keyResults = stepResults
      .filter(r => r.status === 'success' && r.result)
      .map(r => `${r.actionName}: ${typeof r.result === 'string' ? r.result.substring(0, 100) : 'Executed successfully'}...`);

    const errors = stepResults
      .filter(r => r.status === 'failed' && r.error)
      .map(r => `${r.actionName}: ${r.error}`);

    const contextForNextIteration = this.generateContextForNextIteration(stepResults, plan);

    return {
      totalSteps,
      successfulSteps,
      failedSteps,
      skippedSteps,
      totalExecutionTime,
      actionsExecuted,
      keyResults,
      errors,
      contextForNextIteration
    };
  }

  /**
   * Gera contexto para próxima iteração
   * @param stepResults Resultados dos passos
   * @param plan Plano executado
   * @returns Contexto sintético
   */
  private generateContextForNextIteration(stepResults: ExecutionResult[], plan: ExecutionPlan): string {
    const successfulResults = stepResults.filter(r => r.status === 'success');
    const keyInsights = successfulResults
      .map(r => `${r.actionName} foi executado com sucesso`)
      .slice(0, 3);

    const mainChallenges = stepResults
      .filter(r => r.status === 'failed')
      .map(r => `${r.actionName} falhou: ${r.error}`)
      .slice(0, 2);

    return `Execução do plano para "${plan.originalMessage}": ${successfulResults.length}/${stepResults.length} passos bem-sucedidos. ` +
           `Principais realizações: ${keyInsights.join(', ')}. ` +
           `${mainChallenges.length > 0 ? `Desafios encontrados: ${mainChallenges.join(', ')}.` : ''}`;
  }

  /**
   * Gera resposta final para o usuário
   * @param plan Plano executado
   * @param stepResults Resultados dos passos
   * @param summary Resumo da execução
   * @returns Resposta final
   */
  private async generateFinalResponse(
    plan: ExecutionPlan, 
    stepResults: ExecutionResult[], 
    summary: ExecutionSummary
  ): Promise<string> {
    try {
      const provider = await this.llmManager.getAvailableProvider();
      if (!provider) {
        return this.generateFallbackFinalResponse(plan, stepResults, summary);
      }

      const finalResponsePrompt = this.buildFinalResponsePrompt(plan, stepResults, summary);
      
      const finalResponse = await Promise.race([
        provider.generateSingleResponse(finalResponsePrompt),
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Final response timeout')), 60000)
        )
      ]);

      // Verificar se a resposta não está vazia
      if (!finalResponse || finalResponse.trim().length === 0) {
        console.warn('Empty final response from LLM, using fallback');
        return this.generateFallbackFinalResponse(plan, stepResults, summary);
      }

      return finalResponse;

    } catch (error) {
      console.error('Failed to generate final response:', error);
      return this.generateFallbackFinalResponse(plan, stepResults, summary);
    }
  }

  /**
   * Constrói prompt para resposta final
   * @param plan Plano executado
   * @param stepResults Resultados dos passos
   * @param summary Resumo da execução
   * @returns Prompt formatado
   */
  private buildFinalResponsePrompt(
    plan: ExecutionPlan, 
    stepResults: ExecutionResult[], 
    summary: ExecutionSummary
  ): string {
    const successfulResults = stepResults
      .filter(r => r.status === 'success' && r.result)
      .map(r => `- ${r.actionName}: ${typeof r.result === 'string' ? r.result.substring(0, 300) : 'Executed successfully'}`)
      .join('\n');

    return `Você é um agente que precisa fornecer uma resposta final ao usuário baseada na execução de um plano estruturado.

MENSAGEM ORIGINAL DO USUÁRIO:
"${plan.originalMessage}"

RESUMO DA EXECUÇÃO:
- Total de passos: ${summary.totalSteps}
- Passos bem-sucedidos: ${summary.successfulSteps}
- Passos que falharam: ${summary.failedSteps}
- Tempo total: ${Math.round(summary.totalExecutionTime / 1000)}s

PRINCIPAIS RESULTADOS OBTIDOS:
${successfulResults}

${summary.errors.length > 0 ? `ERROS ENCONTRADOS:\n${summary.errors.map(e => `- ${e}`).join('\n')}\n` : ''}

INSTRUÇÕES:
1. Crie uma resposta completa e útil para o usuário
2. Integre as informações obtidas de forma coerente
3. Destaque os principais resultados e insights
4. Se houve falhas, explique de forma construtiva
5. Mantenha um tom profissional e útil

RESPOSTA FINAL:
`;
  }

  /**
   * Gera resposta final de fallback
   * @param plan Plano executado
   * @param stepResults Resultados dos passos
   * @param summary Resumo da execução
   * @returns Resposta de fallback
   */
  private generateFallbackFinalResponse(
    plan: ExecutionPlan, 
    stepResults: ExecutionResult[], 
    summary: ExecutionSummary
  ): string {
    const successRate = Math.round((summary.successfulSteps / summary.totalSteps) * 100);
    
    let response = `Concluí a execução do seu pedido: "${plan.originalMessage}"\n\n`;
    
    // Resumo da execução
    response += `📊 **Resumo da Execução:**\n`;
    response += `• Total de passos executados: ${summary.totalSteps}\n`;
    response += `• Taxa de sucesso: ${successRate}% (${summary.successfulSteps}/${summary.totalSteps})\n`;
    response += `• Tempo total: ${Math.round(summary.totalExecutionTime / 1000)} segundos\n\n`;
    
    // Principais resultados
    if (summary.keyResults.length > 0) {
      response += `🎯 **Principais Resultados:**\n`;
      summary.keyResults.forEach(result => {
        response += `• ${result}\n`;
      });
      response += '\n';
    }
    
    // Detalhes dos passos bem-sucedidos
    const successfulSteps = stepResults.filter(s => s.status === 'success' && s.result);
    if (successfulSteps.length > 0) {
      response += `✅ **Ações Executadas com Sucesso:**\n`;
      successfulSteps.forEach(step => {
        response += `• **${step.actionName}**: `;
        if (typeof step.result === 'string' && step.result.length > 0) {
          const summary = step.result.length > 150 
            ? step.result.substring(0, 150) + '...' 
            : step.result;
          response += summary + '\n';
        } else {
          response += 'Executado com sucesso\n';
        }
      });
      response += '\n';
    }
    
    // Erros encontrados
    if (summary.errors.length > 0) {
      response += `⚠️ **Desafios Encontrados:**\n`;
      summary.errors.forEach(error => {
        response += `• ${error}\n`;
      });
      response += '\n';
    }
    
    // Conclusão
    if (summary.successfulSteps === summary.totalSteps) {
      response += `🎉 **Conclusão:** Todas as ações foram executadas com sucesso!`;
    } else if (summary.successfulSteps > 0) {
      response += `✅ **Conclusão:** Execução parcialmente bem-sucedida. ${summary.successfulSteps} de ${summary.totalSteps} ações foram concluídas.`;
    } else {
      response += `❌ **Conclusão:** A execução encontrou dificuldades. Recomendo revisar os parâmetros e tentar novamente.`;
    }
    
    return response;
  }
}
