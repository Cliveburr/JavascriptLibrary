import type { ConfigService } from '../../services';
import type { LlmResponse, EmbeddingRequest, EmbeddingResponse, LlmRequest } from '../llm.types';

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
    embeddings?: number[][];
    prompt_eval_count?: number;
}

export class OllamaProvider {
    private config: OllamaConfig;

    constructor(configService: ConfigService) {
        this.config = configService.getOllamaConfig();
    }

    async invoke(request: LlmRequest): Promise<LlmResponse> {
        if (!this.config.baseUrl) {
            throw new Error('Ollama URL is required');
        }

        const requestBody = {
            model: request.model,
            messages: request.messages,
            options: {
                temperature: request.options?.temperature,
                num_predict: request.options?.maxTokens,
            },
            stream: false
        };

        const response = await fetch(`${this.config.baseUrl}/api/chat`, {
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

    async invokeAsync(request: LlmRequest, streamCallback: (content: string) => void): Promise<LlmResponse> {
        if (!this.config.baseUrl) {
            throw new Error('Ollama URL is required');
        }

        const requestBody = {
            model: request.model,
            messages: request.messages,
            options: {
                temperature: request.options?.temperature,
                num_predict: request.options?.maxTokens,
            },
            stream: true
        };

        const response = await fetch(`${this.config.baseUrl}/api/chat`, {
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
                            streamCallback(data.message.content);
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

        return {
            content: fullContent,
            usage: {
                promptTokens: totalPromptTokens,
                completionTokens: totalCompletionTokens,
                totalTokens: totalPromptTokens + totalCompletionTokens,
            },
        };
    }

    async invokeBodyJSONAsync(request: LlmRequest, sentinel: string, bodyStreamCallback: (content: string) => void): Promise<LlmResponse> {
        if (!this.config.baseUrl) {
            throw new Error('Ollama URL is required');
        }

        const requestBody = {
            model: request.model,
            messages: request.messages,
            options: {
                temperature: request.options?.temperature,
                num_predict: request.options?.maxTokens,
            },
            stream: true
        };

        const response = await fetch(`${this.config.baseUrl}/api/chat`, {
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

        // Usage tracking
        let totalPromptTokens = 0;
        let totalCompletionTokens = 0;

        // Body/JSON partition state
        let inJson = false;
        let bodyTail = '';
        let bodyAccumulated = '';
        let jsonBuffer = '';

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Failed to get response reader');
        }

        const decoder = new TextDecoder();
        let lineBuffer = '';

        // Helper to process a piece of model output content
        const processContentChunk = (piece: string) => {
            if (!piece) return;

            // If we've already entered JSON tail, just accumulate
            if (inJson) {
                jsonBuffer += piece;
                return;
            }

            // While in Body, avoid emitting any part of the sentinel.
            if (!sentinel) {
                // No sentinel provided, stream as-is
                bodyStreamCallback(piece);
                bodyAccumulated += piece;
                return;
            }

            const combined = bodyTail + piece;
            const idx = combined.indexOf(sentinel);
            if (idx >= 0) {
                // Emit everything before the sentinel as body
                const before = combined.slice(0, idx);
                if (before) {
                    bodyStreamCallback(before);
                    bodyAccumulated += before;
                }

                // Advance past sentinel and optional newline right after it
                let after = combined.slice(idx + sentinel.length);
                if (after.startsWith('\r\n')) after = after.slice(2);
                else if (after.startsWith('\n')) after = after.slice(1);

                inJson = true;
                jsonBuffer += after;
                bodyTail = '';
                return;
            }

            // No sentinel yet; emit safe prefix, keep last (sentinel.length - 1) chars buffered
            const keep = Math.max(0, sentinel.length - 1);
            const safeLen = Math.max(0, combined.length - keep);
            if (safeLen > 0) {
                const emit = combined.slice(0, safeLen);
                bodyStreamCallback(emit);
                bodyAccumulated += emit;
            }
            bodyTail = combined.slice(safeLen);
        };

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                lineBuffer += chunkText;

                // Process complete lines from the Ollama NDJSON stream
                let newlineIndex: number;
                while ((newlineIndex = lineBuffer.indexOf('\n')) !== -1) {
                    const rawLine = lineBuffer.slice(0, newlineIndex).trim();
                    lineBuffer = lineBuffer.slice(newlineIndex + 1);
                    if (!rawLine) continue;

                    try {
                        const data = JSON.parse(rawLine) as OllamaChatResponse;

                        if (data.message?.content) {
                            processContentChunk(data.message.content);
                        }

                        if (typeof data.prompt_eval_count === 'number') {
                            totalPromptTokens = data.prompt_eval_count;
                        }
                        if (typeof data.eval_count === 'number') {
                            totalCompletionTokens = data.eval_count;
                        }
                    } catch {
                        // Ignore malformed JSON lines (can happen mid-chunk)
                    }
                }
            }

            // Process any remaining partial line
            const tail = lineBuffer.trim();
            if (tail) {
                try {
                    const data = JSON.parse(tail) as OllamaChatResponse;
                    if (data.message?.content) {
                        processContentChunk(data.message.content);
                    }
                    if (typeof data.prompt_eval_count === 'number') {
                        totalPromptTokens = data.prompt_eval_count;
                    }
                    if (typeof data.eval_count === 'number') {
                        totalCompletionTokens = data.eval_count;
                    }
                } catch {
                    // Best-effort: ignore last partial line
                }
            }
        } finally {
            reader.releaseLock();
        }

        // Flush any remaining body tail if sentinel never appeared
        if (!inJson && bodyTail) {
            bodyStreamCallback(bodyTail);
            bodyAccumulated += bodyTail;
            bodyTail = '';
        }

        const fullContent = bodyAccumulated + sentinel + jsonBuffer;

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
        if (!this.config.baseUrl) {
            throw new Error('Ollama URL is required');
        }

        const requestBody = {
            model: request.model,
            input: request.input,
        };

        const response = await fetch(`${this.config.baseUrl}/api/embed`, {
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
            embeddings: data.embeddings || [],
            usage: {
                promptTokens: data.prompt_eval_count || 0,
                completionTokens: 0,
                totalTokens: data.prompt_eval_count || 0
            },
        };
    }
}
