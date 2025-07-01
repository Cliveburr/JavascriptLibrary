// Interface for LLM providers
export interface LLMProvider {
  generateResponse(message: string, model?: string): AsyncIterable<string>;
  generateSingleResponse(message: string, model?: string): Promise<string>;
  isAvailable(): Promise<boolean>;
  getAvailableModels(): Promise<string[]>;
}

// Base response interface for streaming
export interface StreamResponse {
  content: string;
  done?: boolean;
  error?: string;
}

// Interface para decomposição de mensagens
export interface MessageDecomposition {
  originalMessage: string;
  decomposedItems: string[];
  timestamp: string;
  totalItems: number;
}

// Interface para pipeline de raciocínio
export interface ReasoningPipeline {
  step: number;
  stepName: string;
  input: any;
  output: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  timestamp: string;
}

// Interface para planejamento de execução
export interface ExecutionPlanAction {
  stepNumber: number;
  actionName: string;
  actionDescription: string;
  itemIndex: number; // Referência ao índice do item na decomposição original
  justification: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface ExecutionPlan {
  originalMessage: string;
  decomposition: MessageDecomposition;
  enrichedDecomposition?: EnrichedDecomposition;
  actions: ExecutionPlanAction[];
  timestamp: string;
}

export interface AgentResponse {
  decomposition: MessageDecomposition;
  pipeline: ReasoningPipeline[];
  executionPlan?: ExecutionPlan;
  finalResponse: string;
  summary: string;
}

// Interface para embeddings e busca vetorial
export interface EmbeddingItem {
  id: string;
  content: string;
  embedding: number[];
  contextSources?: ContextSource[];
}

export interface ContextSource {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

export interface VectorSearchResult {
  item: string;
  embedding: number[];
  relatedContext: ContextSource[];
}

export interface EnrichedDecomposition extends MessageDecomposition {
  enrichedItems: VectorSearchResult[];
}

// Interface para configuração do Qdrant
export interface QdrantConfig {
  host: string;
  port: number;
  apiKey?: string;
  collectionName: string;
}
