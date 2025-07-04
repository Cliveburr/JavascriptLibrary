// Interface for LLM providers
export interface LLMProvider {
  /**
   * Gera respostas de forma iterável e assíncrona a partir de uma mensagem
   * @param message Mensagem para a qual se deseja gerar uma resposta
   * @param model Modelo opcional a ser usado para gerar a resposta
   * @returns Um iterável assíncrono de strings contendo partes da resposta
   */
  generateResponse(message: string, model?: string): AsyncIterable<string>;

  /**
   * Gera uma resposta única e completa a partir de uma mensagem
   * @param message Mensagem para a qual se deseja gerar uma resposta
   * @param model Modelo opcional a ser usado para gerar a resposta
   * @returns Uma promessa que resolve para a resposta completa em forma de string
   */
  generateSingleResponse(message: string, model?: string): Promise<string>;
  
  /**
   * Gera embeddings para uma lista de textos usando um modelo específico de embeddings
   * @param texts Lista de textos para os quais se deseja gerar embeddings
   * @param model Modelo opcional a ser usado para gerar embeddings (padrão: nomic-embed-text)
   * @returns Uma promessa que resolve para um array de arrays de números representando os embeddings
   */
  generateEmbeddings(texts: string[], model?: string): Promise<number[][]>;

  /**
   * Verifica se o provedor de LLM está disponível para uso
   * @returns Uma promessa que resolve para um booleano indicando disponibilidade
   */
  isAvailable(): Promise<boolean>;

  /**
   * Obtém a lista de modelos disponíveis no provedor
   * @returns Uma promessa que resolve para um array de strings com os nomes dos modelos
   */
  getAvailableModels(): Promise<string[]>;

  /**
   * Gera respostas de forma iterável e assíncrona a partir de múltiplas mensagens (conversação)
   * @param messages Array de mensagens da conversação
   * @param model Modelo opcional a ser usado para gerar a resposta
   * @returns Um iterável assíncrono de strings contendo partes da resposta
   */
  generateConversationResponse(messages: Array<{role: 'user' | 'assistant', content: string}>, model?: string): AsyncIterable<string>;
}

// Base response interface for streaming
export interface StreamResponse {
  /**
   * Conteúdo da resposta em streaming
   */
  content: string;

  /**
   * Indica se o streaming foi concluído
   */
  done?: boolean;

  /**
   * Mensagem de erro caso ocorra algum problema
   */
  error?: string;
}

// Interface para decomposição de mensagens
export interface MessageDecomposition {
  /**
   * Mensagem original enviada pelo usuário
   */
  originalMessage: string;

  /**
   * Lista de itens decompostos da mensagem original
   */
  decomposedItems: string[];

  /**
   * Data e hora da decomposição
   */
  timestamp: string;

  /**
   * Número total de itens na decomposição
   */
  totalItems: number;
}

// Interface para pipeline de raciocínio
export interface ReasoningPipeline {
  /**
   * Número da etapa no pipeline de raciocínio
   */
  step: number;

  /**
   * Nome da etapa atual do pipeline
   */
  stepName: string;

  /**
   * Dados de entrada para esta etapa do pipeline
   */
  input: any;

  /**
   * Resultado da execução desta etapa do pipeline
   */
  output: any;

  /**
   * Estado atual da etapa (pendente, em progresso, concluída, falha)
   */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';

  /**
   * Data e hora de execução desta etapa
   */
  timestamp: string;
}

// Interface para planejamento de execução
export interface ExecutionPlanAction {
  /**
   * Número da etapa no plano de execução
   */
  stepNumber: number;

  /**
   * Nome da ação a ser executada
   */
  actionName: string;

  /**
   * Descrição detalhada da ação a ser executada
   */
  actionDescription: string;

  /**
   * Referência ao índice do item na decomposição original
   */
  itemIndex: number;

  /**
   * Justificativa para a execução desta ação neste momento
   */
  justification: string;

  /**
   * Estado atual da ação (pendente, em progresso, concluída, falha)
   */
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface ExecutionPlan {
  /**
   * Mensagem original do usuário
   */
  originalMessage: string;

  /**
   * Decomposição da mensagem em itens
   */
  decomposition: MessageDecomposition;

  /**
   * Decomposição enriquecida com contexto (opcional)
   */
  enrichedDecomposition?: EnrichedDecomposition;

  /**
   * Lista de ações a serem executadas
   */
  actions: ExecutionPlanAction[];

  /**
   * Data e hora de criação do plano
   */
  timestamp: string;
}

export interface AgentResponse {
  /**
   * Resultado da decomposição da mensagem do usuário
   */
  decomposition: MessageDecomposition;

  /**
   * Pipeline de raciocínio executado pelo agente
   */
  pipeline: ReasoningPipeline[];

  /**
   * Plano de execução gerado (opcional)
   */
  executionPlan?: ExecutionPlan;

  /**
   * Resposta final completa gerada pelo agente
   */
  finalResponse: string;

  /**
   * Resumo do processamento e da resposta
   */
  summary: string;
}

// Interface para embeddings e busca vetorial
export interface EmbeddingItem {
  /**
   * Identificador único do item
   */
  id: string;

  /**
   * Conteúdo textual associado ao embedding
   */
  content: string;

  /**
   * Vetor de embedding representando o conteúdo no espaço vetorial
   */
  embedding: number[];

  /**
   * Fontes de contexto relacionadas a este item (opcional)
   */
  contextSources?: ContextSource[];
}

export interface ContextSource {
  /**
   * Identificador único da fonte de contexto
   */
  id: string;

  /**
   * Conteúdo textual da fonte de contexto
   */
  content: string;

  /**
   * Pontuação de similaridade com a consulta
   */
  score: number;

  /**
   * Metadados adicionais associados à fonte de contexto
   */
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  /**
   * Conteúdo do item encontrado na busca
   */
  item: string;

  /**
   * Vetor de embedding do item
   */
  embedding: number[];

  /**
   * Fontes de contexto relacionadas ao item
   */
  relatedContext: ContextSource[];
}

export interface EnrichedDecomposition extends MessageDecomposition {
  /**
   * Itens da decomposição enriquecidos com informações vetoriais e contexto
   */
  enrichedItems: VectorSearchResult[];
}

// Interface para configuração do Qdrant
export interface QdrantConfig {
  /**
   * Endereço do servidor Qdrant
   */
  host: string;

  /**
   * Porta de acesso ao servidor Qdrant
   */
  port: number;

  /**
   * Chave de API para autenticação (opcional)
   */
  apiKey?: string;

  /**
   * Nome da coleção a ser utilizada no Qdrant
   */
  collectionName: string;
}

// Interfaces para execução de planos
export interface ExecutionResult {
  /**
   * Número do passo executado
   */
  stepNumber: number;

  /**
   * Nome da ação executada
   */
  actionName: string;

  /**
   * Resultado da execução da ação
   */
  result: any;

  /**
   * Status da execução
   */
  status: 'success' | 'failed' | 'skipped';

  /**
   * Mensagem explicativa do resultado
   */
  message: string;

  /**
   * Tempo de execução em milissegundos
   */
  executionTime: number;

  /**
   * Data e hora da execução
   */
  timestamp: string;

  /**
   * Erro ocorrido durante a execução (se houver)
   */
  error?: string;
}

export interface ExecutionSummary {
  /**
   * Número total de passos executados
   */
  totalSteps: number;

  /**
   * Número de passos executados com sucesso
   */
  successfulSteps: number;

  /**
   * Número de passos que falharam
   */
  failedSteps: number;

  /**
   * Número de passos que foram pulados
   */
  skippedSteps: number;

  /**
   * Tempo total de execução em milissegundos
   */
  totalExecutionTime: number;

  /**
   * Resumo das ações executadas
   */
  actionsExecuted: string[];

  /**
   * Principais resultados obtidos
   */
  keyResults: string[];

  /**
   * Erros encontrados durante a execução
   */
  errors: string[];

  /**
   * Informações de contexto para próxima iteração
   */
  contextForNextIteration: string;
}

export interface ExecutionReport {
  /**
   * Plano original que foi executado
   */
  originalPlan: ExecutionPlan;

  /**
   * Resultados detalhados de cada passo
   */
  stepResults: ExecutionResult[];

  /**
   * Resumo da execução
   */
  summary: ExecutionSummary;

  /**
   * Resposta final para o usuário
   */
  finalResponse: string;

  /**
   * Indica se foi necessário replanejamento
   */
  wasReplanned: boolean;

  /**
   * Novo plano criado durante replanejamento (se aplicável)
   */
  replanedPlan?: ExecutionPlan;

  /**
   * Data e hora de início da execução
   */
  startTime: string;

  /**
   * Data e hora de fim da execução
   */
  endTime: string;
}

export interface ReplanningRequest {
  /**
   * Plano original
   */
  originalPlan: ExecutionPlan;

  /**
   * Resultados executados até agora
   */
  executedResults: ExecutionResult[];

  /**
   * Motivo do replanejamento
   */
  reason: string;

  /**
   * Contexto adicional para o replanejamento
   */
  additionalContext: string;
}
