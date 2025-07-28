import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from '../src/llm/providers/ollama.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('OllamaProvider', () => {
    let provider: OllamaProvider;

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new OllamaProvider({
            baseUrl: 'http://localhost:11434'
        });
    });

    it('should invoke Ollama API successfully', async () => {
        const mockResponse = {
            message: {
                content: 'Hello! How can I assist you?'
            },
            prompt_eval_count: 15,
            eval_count: 25
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Hello' }];
        const response = await provider.invoke(messages);

        expect(response.content).toBe('Hello! How can I assist you?');
        expect(response.usage).toEqual({
            promptTokens: 15,
            completionTokens: 25,
            totalTokens: 40
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:11434/api/chat',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'phi3',
                    messages,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        num_predict: undefined
                    }
                })
            })
        );
    });

    it('should handle custom options', async () => {
        const mockResponse = {
            message: { content: 'Response' },
            prompt_eval_count: 5,
            eval_count: 10
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Test' }];
        const options = {
            model: 'llama2',
            temperature: 0.3,
            maxTokens: 50
        };

        await provider.invoke(messages, options);

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:11434/api/chat',
            expect.objectContaining({
                body: JSON.stringify({
                    model: 'llama2',
                    messages,
                    stream: false,
                    options: {
                        temperature: 0.3,
                        num_predict: 50
                    }
                })
            })
        );
    });

    it('should use default baseUrl from environment', () => {
        process.env.OLLAMA_BASE_URL = 'http://custom-ollama:11434';
        const providerWithEnv = new OllamaProvider();

        // Access private property for testing
        expect((providerWithEnv as any).baseUrl).toBe('http://custom-ollama:11434');

        delete process.env.OLLAMA_BASE_URL;
    });

    it('should throw error on API failure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            text: () => Promise.resolve('Server error occurred')
        });

        const messages = [{ role: 'user', content: 'Hello' }];

        await expect(provider.invoke(messages)).rejects.toThrow('Ollama API error: 500 Internal Server Error');
    });

    it('should handle missing content in response', async () => {
        const mockResponse = {
            message: {},
            prompt_eval_count: 5,
            eval_count: 0
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Hello' }];
        const response = await provider.invoke(messages);

        expect(response.content).toBe('');
        expect(response.usage?.totalTokens).toBe(5);
    });

    it('should handle missing usage data', async () => {
        const mockResponse = {
            message: { content: 'Response without usage data' }
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Hello' }];
        const response = await provider.invoke(messages);

        expect(response.content).toBe('Response without usage data');
        expect(response.usage).toEqual({
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
        });
    });
});
