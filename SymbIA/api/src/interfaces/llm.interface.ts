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
