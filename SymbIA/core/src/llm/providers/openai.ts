import type { LlmRequest, LlmResponse, EmbeddingRequest, EmbeddingResponse } from '../../types/llm.js';
import { ConfigService } from '../../config/config.service.js';

export interface OpenAIConfig {
    apiKey: string;
    baseUrl?: string;
}

interface OpenAIUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

interface OpenAIChoice {
    message: {
        content: string;
    };
}

interface OpenAICompletionResponse {
    choices: OpenAIChoice[];
    usage: OpenAIUsage;
}

interface OpenAIEmbeddingData {
    embedding: number[];
}

interface OpenAIEmbeddingResponse {
    data: OpenAIEmbeddingData[];
    usage: {
        prompt_tokens: number;
        total_tokens: number;
    };
}

export class OpenAIProvider {
    private apiKey: string;
    private baseUrl: string;

    constructor(configService: ConfigService) {
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

        const data = await response.json() as OpenAICompletionResponse;

        return {
            content: data.choices[0]?.message?.content || '',
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
                completionTokens: data.usage?.completion_tokens || 0,
                totalTokens: data.usage?.total_tokens || 0,
            },
        };
    }

    async invokeAsync(
        messages: LlmRequest['messages'],
        options: Partial<LlmRequest>,
        streamCallback: (content: string) => void,
    ): Promise<LlmResponse> {
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const requestBody = {
            model: options?.model || 'gpt-4o',
            messages,
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.maxTokens,
            stream: true,
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

        let fullContent = '';
        let totalPromptTokens = 0;
        let totalCompletionTokens = 0;

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
                const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                for (const line of lines) {
                    const data = line.replace('data: ', '');
                    if (data === '[DONE]') continue;

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;

                        if (content) {
                            fullContent += content;
                            streamCallback(content);
                        }

                        if (parsed.usage) {
                            totalPromptTokens = parsed.usage.prompt_tokens || 0;
                            totalCompletionTokens = parsed.usage.completion_tokens || 0;
                        }
                    } catch (parseError) {
                        // Ignore malformed JSON chunks
                        console.warn('Failed to parse OpenAI stream chunk:', parseError);
                    }
                }
            }
        } finally {
            reader.releaseLock();
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
        if (!this.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        const requestBody = {
            input: request.input, // Pode ser string ou array de strings
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

        const data = await response.json() as OpenAIEmbeddingResponse;

        // Extrair todos os embeddings da resposta
        const embeddings = data.data.map(item => item.embedding);

        return {
            embeddings,
            usage: {
                promptTokens: data.usage?.prompt_tokens || 0,
            },
        };
    }
}
