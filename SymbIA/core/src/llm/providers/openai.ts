import { injectable, inject } from 'tsyringe';
import type { LlmRequest, LlmResponse, EmbeddingRequest, EmbeddingResponse } from '@symbia/interfaces';
import { ConfigService } from '../../config/config.service.js';

export interface OpenAIConfig {
    apiKey: string;
    baseUrl?: string;
}

@injectable()
export class OpenAIProvider {
    private apiKey: string;
    private baseUrl: string;

    constructor(@inject(ConfigService) configService: ConfigService) {
        const openaiConfig = configService.getOpenAIConfig();
        this.apiKey = openaiConfig.apiKey || '';
        this.baseUrl = openaiConfig.baseUrl;
    }

    async invoke(messages: LlmRequest['messages'], options?: Partial<LlmRequest>): Promise<LlmResponse> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const requestBody = {
            model: options?.model || 'gpt-4o',
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
        };

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        return {
            content: data.choices[0]?.message?.content || '',
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const requestBody = {
            input: request.text,
            model: request.model || 'text-embedding-ada-002',
            encoding_format: 'float',
        };

        const response = await fetch(`${this.baseUrl}/embeddings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`OpenAI Embedding API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        return {
            embedding: data.data[0]?.embedding || [],
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }
}
