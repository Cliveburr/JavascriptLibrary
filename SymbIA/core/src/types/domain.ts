import { ObjectId } from 'mongodb';

// Domain entities
export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    defaultMemoryId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface Memory {
    _id: ObjectId;
    userId: ObjectId;
    name: string;
    totalChatCreated: number;
    createdAt: Date;
    deletedAt?: Date;
}

export interface Chat {
    _id: ObjectId;
    memoryId: ObjectId;
    title: string;
    orderIndex: number;
    createdAt: Date;
    updatedAt?: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';
export type MessageModal = 'text' | 'form' | 'chart' | 'file' | 'memory';

export interface Message {
    _id: ObjectId;
    chatId: ObjectId;
    role: MessageRole;
    modal: MessageModal;

    // Conteúdo
    content: string;
    createdAt: Date;

    // Provedor / modelo
    // provider: 'openai' | 'ollama' | 'azureOpenAI';
    // modelName: string;
    // providerRequestId?: string;
    // systemFingerprint?: string;

    // Métricas de uso
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    // pricePer1kTokensUSD?: number;
    // costUSD?: number;

    // Performance
    latencyMs?: number;
    // finishReason?: 'stop' | 'length' | 'tool_call' | 'error';
    // status: 'success' | 'retry' | 'timeout' | 'rate_limited' | 'error';
    // errorMessage?: string;
}

export interface VectorEntry {
    _id: ObjectId;
    memoryId: ObjectId;
    embedding: number[];
    payload: {
        type: string;
        tags: string[];
        timestamp: Date;
    };
}
