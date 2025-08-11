import { ObjectId } from 'mongodb';
import { LLMPromptTypes, LlmSetModel } from '../llm';

export type ChatContextType = 'reflection_response' | 'memory_search_response' | 'memory_search_result' | 'reply_response';

export interface ChatContextReflectionResponse {
    reflection: string;
    action: string;
}

export interface ChatContextMemorySearchResponse {
    explanationBody: string;
    queriesJSON: {
        searchGroups: Array<{
            purpose: string,
            keywords: string;
        }>;
    };
}

export interface ChatContextMemorySearchResult {
    queries: Array<{
        keywords: string;
        found: boolean;
        vector_id?: string;
        value?: string;
    }>;
}

export interface ChatContextReplyResponse {
    content: string;
}

export interface ChatContext {
    type: ChatContextType;
    reflectionResponse?: ChatContextReflectionResponse;
    memorySearchResponse?: ChatContextMemorySearchResponse;
    memorySearchResult?: ChatContextMemorySearchResult;
    replyResponse?: ChatContextReplyResponse;
}

export interface ChatIterationLLMRequest {
    requestId: string;
    promptType: LLMPromptTypes;
    llmSetModel: LlmSetModel;
    systemPrompt: string;
    llmResponse?: string;

    forUser?: string;
    forContext?: any;

    contexts: ChatContext[];

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