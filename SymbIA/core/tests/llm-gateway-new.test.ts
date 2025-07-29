import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LlmGateway } from '../src/llm/LlmGateway.js';
import { LlmSetService } from '../src/llm/llm-set.service.js';
import { OpenAIProvider } from '../src/llm/providers/openai.js';
import { OllamaProvider } from '../src/llm/providers/ollama.js';
import type { LlmSetConfig } from '@symbia/interfaces';

// Mock the providers
vi.mock('../src/llm/providers/openai.js');
vi.mock('../src/llm/providers/ollama.js');
vi.mock('../src/llm/llm-set.service.js');

const MockedOpenAIProvider = vi.mocked(OpenAIProvider);
const MockedOllamaProvider = vi.mocked(OllamaProvider);
const MockedLlmSetService = vi.mocked(LlmSetService);

describe('LlmGateway', () => {
    let gateway: LlmGateway;
    let mockLlmSetService: any;
    let mockOpenAIProvider: any;
    let mockOllamaProvider: any;
    let mockLlmSetConfig: LlmSetConfig;

    beforeEach(() => {
        vi.clearAllMocks();

        mockLlmSetService = {
            getModelSpecWithFallback: vi.fn()
        };

        mockOpenAIProvider = {
            invoke: vi.fn()
        };

        mockOllamaProvider = {
            invoke: vi.fn()
        };

        mockLlmSetConfig = {
            id: 'test-set',
            display: 'Test Set',
            icon: { type: 'emoji', emoji: '🤖' },
            models: {
                chat: { provider: 'ollama', model: 'llama3:8b' },
                reasoning: { provider: 'ollama', model: 'llama3:8b' }
            }
        };

        MockedLlmSetService.mockImplementation(() => mockLlmSetService);
        MockedOpenAIProvider.mockImplementation(() => mockOpenAIProvider);
        MockedOllamaProvider.mockImplementation(() => mockOllamaProvider);

        gateway = new LlmGateway(mockLlmSetService, mockOpenAIProvider, mockOllamaProvider);
    });

    it('should route chat requests to Ollama provider', async () => {
        const messages = [{ role: 'user', content: 'Hello' }];
        const expectedResponse = { content: 'Response from Ollama', usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 } };

        mockLlmSetService.getModelSpecWithFallback.mockReturnValue({ provider: 'ollama', model: 'llama3:8b' });
        mockOllamaProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke(mockLlmSetConfig, 'chat', messages);

        expect(response).toBe(expectedResponse);
        expect(mockLlmSetService.getModelSpecWithFallback).toHaveBeenCalledWith(mockLlmSetConfig, 'chat');
        expect(mockOllamaProvider.invoke).toHaveBeenCalledWith(messages, { model: 'llama3:8b' });
        expect(mockOpenAIProvider.invoke).not.toHaveBeenCalled();
    });

    it('should route reasoning requests to Ollama provider', async () => {
        const messages = [{ role: 'user', content: 'Think about this' }];
        const expectedResponse = { content: 'Thoughtful response', usage: { promptTokens: 8, completionTokens: 15, totalTokens: 23 } };

        mockLlmSetService.getModelSpecWithFallback.mockReturnValue({ provider: 'ollama', model: 'llama3:8b' });
        mockOllamaProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke(mockLlmSetConfig, 'reasoning', messages);

        expect(response).toBe(expectedResponse);
        expect(mockLlmSetService.getModelSpecWithFallback).toHaveBeenCalledWith(mockLlmSetConfig, 'reasoning');
        expect(mockOllamaProvider.invoke).toHaveBeenCalledWith(messages, { model: 'llama3:8b' });
    });

    it('should route OpenAI requests when model spec indicates openai provider', async () => {
        const messages = [{ role: 'user', content: 'Generate text' }];
        const expectedResponse = { content: 'Generated text', usage: { promptTokens: 6, completionTokens: 12, totalTokens: 18 } };

        mockLlmSetService.getModelSpecWithFallback.mockReturnValue({ provider: 'openai', model: 'gpt-4' });
        mockOpenAIProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke(mockLlmSetConfig, 'chat', messages);

        expect(response).toBe(expectedResponse);
        expect(mockOpenAIProvider.invoke).toHaveBeenCalledWith(messages, { model: 'gpt-4' });
        expect(mockOllamaProvider.invoke).not.toHaveBeenCalled();
    });

    it('should throw error when no model spec is found', async () => {
        const messages = [{ role: 'user', content: 'Hello' }];

        mockLlmSetService.getModelSpecWithFallback.mockReturnValue(null);

        await expect(gateway.invoke(mockLlmSetConfig, 'embedding', messages))
            .rejects.toThrow("No model found for purpose 'embedding' in LLM set 'test-set'");
    });

    it('should throw error for unsupported provider', async () => {
        const messages = [{ role: 'user', content: 'Hello' }];

        mockLlmSetService.getModelSpecWithFallback.mockReturnValue({ provider: 'unsupported', model: 'test-model' });

        await expect(gateway.invoke(mockLlmSetConfig, 'chat', messages))
            .rejects.toThrow('Unsupported LLM provider: unsupported');
    });

    it('should get correct provider instances', () => {
        mockLlmSetService.getModelSpecWithFallback.mockReturnValueOnce({ provider: 'openai', model: 'gpt-4' });
        const openaiProvider = gateway.getProvider(mockLlmSetConfig, 'chat');
        expect(openaiProvider).toBe(mockOpenAIProvider);

        mockLlmSetService.getModelSpecWithFallback.mockReturnValueOnce({ provider: 'ollama', model: 'llama3:8b' });
        const ollamaProvider = gateway.getProvider(mockLlmSetConfig, 'reasoning');
        expect(ollamaProvider).toBe(mockOllamaProvider);
    });

    it('should return model specs correctly', () => {
        mockLlmSetService.getModelSpecWithFallback.mockReturnValueOnce({ provider: 'ollama', model: 'llama3:8b' });
        const reasoningSpec = gateway.getModelSpec(mockLlmSetConfig, 'reasoning');
        expect(reasoningSpec).toEqual({ provider: 'ollama', model: 'llama3:8b' });
    });
});
