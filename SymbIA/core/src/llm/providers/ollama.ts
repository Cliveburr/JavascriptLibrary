import { injectable, inject } from 'tsyringe';
import type { LlmRequest, LlmResponse, EmbeddingRequest, EmbeddingResponse } from '@symbia/interfaces';
import { ConfigService } from '../../config/config.service.js';

export interface OllamaConfig {
    baseUrl?: string;
}

@injectable()
export class OllamaProvider {
    private baseUrl: string;

    constructor(@inject(ConfigService) configService: ConfigService) {
        const ollamaConfig = configService.getOllamaConfig();
        this.baseUrl = ollamaConfig.baseUrl;
    }

    async invoke(messages: LlmRequest['messages'], options?: Partial<LlmRequest>): Promise<LlmResponse> {
        const requestBody = {
            model: options?.model || 'phi3',
            messages,
            stream: false,
            options: {
                temperature: options?.temperature ?? 0.7,
                num_predict: options?.maxTokens,
            },
        };

        const response = await fetch(`${this.baseUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.text().catch(() => '');
            throw new Error(`Ollama API error: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json();

        return {
            content: data.message?.content || '',
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: data.eval_count || 0,
                totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
            },
        };
    }

    async generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResponse> {
        const requestBody = {
            model: request.model,
            prompt: request.text,
        };

        const response = await fetch(`${this.baseUrl}/api/embeddings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.text().catch(() => '');
            throw new Error(`Ollama Embedding API error: ${response.status} ${response.statusText} - ${errorData}`);
        }

        const data = await response.json();

        return {
            embedding: data.embedding || [],
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                totalTokens: data.prompt_eval_count || 0,
            },
        };
    }
}
