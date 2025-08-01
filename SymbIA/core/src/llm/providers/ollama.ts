import type { LlmRequest, LlmResponse, EmbeddingRequest, EmbeddingResponse } from '../../types/llm.js';
import { ConfigService } from '../../config/config.service.js';

export interface OllamaConfig {
    baseUrl?: string;
}

interface OllamaChatResponse {
    message?: {
        content?: string;
    };
    prompt_eval_count?: number;
    eval_count?: number;
}

interface OllamaEmbeddingResponse {
    embedding?: number[];
    prompt_eval_count?: number;
}

export class OllamaProvider {
    private baseUrl: string;

    constructor(configService: ConfigService) {
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

        const data = await response.json() as OllamaChatResponse;

        return {
            content: data.message?.content || '',
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: data.eval_count || 0,
                totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
            },
        };
    }

    async invokeAsync(
        messages: LlmRequest['messages'],
        options: Partial<LlmRequest>,
        fristCallback: (content: string) => void,
        chunkCallback: (content: string) => void,
        endCallback?: (content: string) => Promise<void>
    ): Promise<LlmResponse> {
        const requestBody = {
            model: options.model,
            messages,
            stream: true,
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

        let fullContent = '';
        let totalPromptTokens = 0;
        let totalCompletionTokens = 0;
        let isFirstCall = true;

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Failed to get response reader');
        }

        const decoder = new TextDecoder();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());

                for (const line of lines) {
                    try {
                        const data = JSON.parse(line) as OllamaChatResponse;

                        if (data.message?.content) {
                            fullContent += data.message.content;

                            // Send stream progress
                            if (isFirstCall) {
                                fristCallback(data.message.content);
                                isFirstCall = false;
                            }
                            else {
                                chunkCallback(data.message.content);
                            }
                        }

                        if (data.prompt_eval_count) {
                            totalPromptTokens = data.prompt_eval_count;
                        }
                        if (data.eval_count) {
                            totalCompletionTokens = data.eval_count;
                        }
                    } catch (parseError) {
                        // Ignore malformed JSON chunks
                        console.warn('Failed to parse Ollama stream chunk:', parseError);
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }

        if (endCallback) {
            await endCallback(fullContent);
        }

        return {
            content: fullContent,
            usage: {
                promptTokens: totalPromptTokens,
                completionTokens: totalCompletionTokens,
                totalTokens: totalPromptTokens + totalCompletionTokens,
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

        const data = await response.json() as OllamaEmbeddingResponse;

        return {
            embedding: data.embedding || [],
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                totalTokens: data.prompt_eval_count || 0,
            },
        };
    }
}
