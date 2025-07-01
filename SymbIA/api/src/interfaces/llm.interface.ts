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
  decomposedItems: DecomposedItem[];
  timestamp: string;
  totalItems: number;
}

export interface DecomposedItem {
  id: string;
  type: 'intention' | 'context' | 'action' | 'question' | 'instruction';
  content: string;
  priority: number; // 1-5, sendo 5 a maior prioridade
  dependencies?: string[]; // IDs de outros itens que este depende
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

export interface AgentResponse {
  decomposition: MessageDecomposition;
  pipeline: ReasoningPipeline[];
  finalResponse: string;
  summary: string;
}
