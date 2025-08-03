// Frontend-specific types (without MongoDB dependencies)

// Message Types Enum (copy from interfaces to avoid MongoDB dependencies)
export enum MessageType {
    InitStream = 0,
    InitNewStream = 1,
    Completed = 2,
    StreamTitle = 3,
    Thinking = 4,
    StreamText = 5
}

// Message Format Types (copy from interfaces to avoid MongoDB dependencies)
export interface ChatInitStreamMessage {
    type: MessageType.InitStream;
    content: string;
}

export interface ChatInitNewStreamMessage {
    type: MessageType.InitNewStream;
    content: string;
    chatId: string;
}

export interface ChatCompletedMessage {
    type: MessageType.Completed;
}

export interface ChatStreamTitleMessage {
    type: MessageType.StreamTitle;
    content: string;
}

export interface ChatThinkingMessage {
    type: MessageType.Thinking;
}

export interface ChatStreamTextMessage {
    type: MessageType.StreamText;
    content: string;
}

export type MessageFormat = ChatInitStreamMessage | ChatInitNewStreamMessage | ChatCompletedMessage | ChatStreamTitleMessage
    | ChatThinkingMessage | ChatStreamTextMessage;

// Frontend Data Types
export interface FrontendMessage {
    id: string;
    chatId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    contentType: 'text' | 'form' | 'chart' | 'file';
    createdAt: string;
    isStreaming?: boolean;
    isError?: boolean;
}

export interface FrontendChat {
    id: string;
    title: string;
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
        defaultMemoryId: string;
    };
}

export interface RegisterResponse {
    token: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        defaultMemoryId: string;
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
