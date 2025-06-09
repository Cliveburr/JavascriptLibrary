// Interface for LLM providers
export interface LLMProvider {
  generateResponse(message: string, model?: string): AsyncIterable<string>;
  isAvailable(): Promise<boolean>;
  getAvailableModels(): Promise<string[]>;
}

// Base response interface for streaming
export interface StreamResponse {
  content: string;
  done?: boolean;
  error?: string;
}
