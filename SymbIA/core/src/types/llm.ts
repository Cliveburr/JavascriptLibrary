export interface LlmProvider {
    name: string;
    baseUrl?: string;
    apiKey?: string;
}

export interface LlmRequestMessage {
    role: string;
    content: string;
}

export interface LlmRequest {
    messages: Array<LlmRequestMessage>;
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
    promptFormat?: string;
    temperature?: number;
    maxTokens?: number;
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
