// Frontend-specific types (without MongoDB dependencies)

// Message Types Enum (copy from interfaces to avoid MongoDB dependencies)
export enum MessageType {
    User,
    Completed,
    StartTitle,
    ChunkTitle,
    Thinking,
    StartText,
    ChunkText,
    EndText
}

// Message Format Types (copy from interfaces to avoid MongoDB dependencies)
export interface ChatUserMessage {
    type: MessageType.User;
    content: string;
    chatId?: string;
}

export interface ChatCompletedMessage {
    type: MessageType.Completed;
}

export interface ChatStartTitleMessage {
    type: MessageType.StartTitle;
    content: string;
}

export interface ChatChunkTitleMessage {
    type: MessageType.ChunkTitle;
    content: string;
}

export interface ChatThinkingMessage {
    type: MessageType.Thinking;
}

export interface ChatStartTextMessage {
    type: MessageType.StartText;
    content: string;
}

export interface ChatChunkTextMessage {
    type: MessageType.ChunkText;
    content: string;
}

export interface ChatEndTextMessage {
    type: MessageType.EndText;
}

export type MessageFormat = ChatUserMessage | ChatCompletedMessage | ChatStartTitleMessage | ChatChunkTitleMessage
    | ChatThinkingMessage | ChatStartTextMessage | ChatChunkTextMessage | ChatEndTextMessage;

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
    memoryId: string;
    title: string;
    orderIndex: number;
    createdAt: string;
    updatedAt?: string;
}

export interface FrontendMemory {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    deletedAt?: string;
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
