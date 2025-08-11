import type { ObjectId } from 'mongodb';
import { LlmRequestMessage, LlmRequestOptions, LlmSetModel } from '../llm';

export type PromptType = 'reflection' | 'reply' | 'memory_search';

export interface ChatIterationLLMRequest {
    requestId: string;
    llmSetModel: LlmSetModel;

    // Prompt
    promptSetId: ObjectId;
    promptName: PromptType;
    messages: LlmRequestMessage[];
    llmOptions?: LlmRequestOptions;

    // LLM Response
    llmResponse?: string;
    forUser?: string;
    forContext?: any;

    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;

    startedDate: Date;
    finishedDate?: Date;
}

export interface ChatIteration {
    userMessage: string;
    requests: ChatIterationLLMRequest[];

    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;

    startedDate: Date;
    finishedDate?: Date;
}

export interface ChatEntity {
    _id: ObjectId;
    memoryId: ObjectId;
    title: string;
    orderIndex: number;
    createdAt: Date;
    updatedAt?: Date;

    iterations: ChatIteration[];

    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
}