import { ObjectId } from 'mongodb';
import { VectorContentType, VectorContentTypes } from '../memory/qdrant.provider';

// Domain entities
export interface User {
    _id: ObjectId;
    username: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Memory {
    _id: ObjectId;
    userId: ObjectId;
    name: string;
    vectorDatabase: string;
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
export type MessageModal = 'text' | 'reflection' | 'memory' | 'form' | 'chart' | 'file';
export type MessageModalType = string | MessageReflectionModal | MessageMemoryModal;

export interface MessageReflectionModal {
    content: string;
}

export type MessageMemoryStatus = 'prepare' | 'embedding' | 'searching';

export interface MessageMemoryModal {
    title: string;
    explanation: string;
    status?: MessageMemoryStatus;
    memories: Array<{
        keyWords: string;
        vectorId?: string;
        content?: {
            type: VectorContentType,
            value: VectorContentTypes;
        },
        embedding?: number[];
    }>;
    error?: string;
}


export interface Message {
    _id: ObjectId;
    chatId: ObjectId;
    role: MessageRole;
    modal: MessageModal;

    // Conteúdo
    content: MessageModalType;
    createdAt: Date;

    // Provedor / modelo
    // provider: 'openai' | 'ollama' | 'azureOpenAI';
    // modelName: string;
    // providerRequestId?: string;
    // systemFingerprint?: string;

    // Métricas de uso
    promptTokens?: number;
    completionTokens?: number;
    embeedingPromptTokens?: number;

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
