
export interface FrontendChat {
    chatId: string;
    title: string;
    orderIndex: number;
}

export interface FrontendMemory {
    id: string;
    name: string;
}

// Alias for compatibility
export type MemoryDTO = FrontendMemory;

// Auth Types
export interface LoginResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
    };
}

export interface RegisterResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    createdMemory: {
        id: string;
        name: string;
    };
}

// LLM Types
export interface LlmSetIcon {
    type: 'path' | 'svg' | 'emoji';
    d?: string;
    fill?: string;
    svg?: string;
    emoji?: string;
    viewBox?: string;
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

export interface LlmSetListResponse {
    sets: LlmSetConfig[];
}
