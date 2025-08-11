
export type LLMProviders = 'openai' | 'ollama';

export interface LlmProvider {
    name: string;
    baseUrl?: string;
    apiKey?: string;
}

export interface LlmRequest {
    model: string;
    messages: LlmRequestMessage[];
    options?: LlmRequestOptions;
}

export interface LlmRequestMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LlmRequestOptions {
    temperature?: number;
    maxTokens?: number;
}

export interface LlmResponseUsage {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
}

export interface LlmResponse {
    content: string;
    usage?: LlmResponseUsage;
}

export interface EmbeddingRequest {
    model: string;
    input: string[];
}

export interface EmbeddingResponse {
    embeddings: number[][];
    usage?: LlmResponseUsage;
}

// LLM Set types for configuration files
export interface LlmSetIcon {
    type: 'path' | 'svg' | 'emoji';
    d?: string;          // SVG path data
    fill?: string;       // SVG fill color
    svg?: string;        // Full SVG string
    emoji?: string;      // Emoji character
    viewBox?: string;    // SVG viewBox
}

export interface LlmSetModel {
    provider: string;
    model: string;
}

export interface LlmSetConfig {
    id: string;
    display: string;
    index?: number;
    info?: string;
    icon: LlmSetIcon;
    models: {
        reasoning: LlmSetModel;
        reasoningHeavy: LlmSetModel;
        fastChat: LlmSetModel;
        codegen: LlmSetModel;
        embedding: LlmSetModel;
    };
}

// API response types
export interface LlmSetListResponse {
    sets: LlmSetConfig[];
}
