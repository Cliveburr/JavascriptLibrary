import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from '../src/llm/providers/openai.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('OpenAIProvider', () => {
    let provider: OpenAIProvider;

    beforeEach(() => {
        vi.clearAllMocks();
        provider = new OpenAIProvider({
            apiKey: 'test-api-key',
            baseUrl: 'https://api.openai.com/v1'
        });
    });

    it('should invoke OpenAI API successfully', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'Hello! How can I help you today?'
                    }
                }
            ],
            usage: {
                prompt_tokens: 10,
                completion_tokens: 20,
                total_tokens: 30
            }
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Hello' }];
        const response = await provider.invoke(messages);

        expect(response.content).toBe('Hello! How can I help you today?');
        expect(response.usage).toEqual({
            promptTokens: 10,
            completionTokens: 20,
            totalTokens: 30
        });

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.openai.com/v1/chat/completions',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-api-key'
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages,
                    temperature: 0.7,
                    max_tokens: undefined
                })
            })
        );
    });

    it('should handle custom options', async () => {
        const mockResponse = {
            choices: [{ message: { content: 'Response' } }],
            usage: { prompt_tokens: 5, completion_tokens: 10, total_tokens: 15 }
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const messages = [{ role: 'user', content: 'Test' }];
        const options = {
            model: 'gpt-3.5-turbo',
            temperature: 0.5,
            maxTokens: 100
        };

        await provider.invoke(messages, options);

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.openai.com/v1/chat/completions',
            expect.objectContaining({
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages,
                    temperature: 0.5,
                    max_tokens: 100
                })
            })
        );
    });

    it('should throw error when API key is missing', async () => {
        const providerWithoutKey = new OpenAIProvider();
        const messages = [{ role: 'user', content: 'Hello' }];

        await expect(providerWithoutKey.invoke(messages)).rejects.toThrow('OpenAI API key is required');
    });

    it('should throw error on API failure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            json: () => Promise.resolve({ error: 'Invalid API key' })
        });

        const messages = [{ role: 'user', content: 'Hello' }];

        await expect(provider.invoke(messages)).rejects.toThrow('OpenAI API error: 401 Unauthorized');
    });

    it('should handle missing content in response', async () => {
        const mockResponse = {
            choices: [{ message: {} }],
            usage: { prompt_tokens: 5, completion_tokens: 0, total_tokens: 5 }
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
});
