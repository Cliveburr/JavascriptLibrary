import type { ObjectId } from 'mongodb';
import { LlmRequestMessage, LlmRequestOptions, LlmSetModel } from '../llm';

export interface ChatIterationLLMRequest {
    requestId: string;
    llmSetModel: LlmSetModel;

    // Prompt
    promptSetId: ObjectId;
    promptName: string;
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