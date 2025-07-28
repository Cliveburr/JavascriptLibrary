// LLM types and configurations
export type LlmSet = 'fast-chat' | 'reasoning' | 'embedding';

export interface ModelSpec {
  provider: string;
  model: string;
}

export interface LlmProvider {
  name: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface LlmRequest {
  messages: Array<{
    role: string;
    content: string;
  }>;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LlmResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface EmbeddingRequest {
  text: string;
  model: string;
}

export interface EmbeddingResponse {
  embedding: number[];
  usage?: {
    promptTokens: number;
    totalTokens: number;
  };
}
