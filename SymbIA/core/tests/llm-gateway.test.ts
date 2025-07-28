import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LlmGateway } from '../src/llm/LlmGateway.js';
import { LlmSelectorService } from '../src/llm/selector.js';
import { OpenAIProvider } from '../src/llm/providers/openai.js';
import { OllamaProvider } from '../src/llm/providers/ollama.js';

// Mock the providers
vi.mock('../src/llm/providers/openai.js');
vi.mock('../src/llm/providers/ollama.js');

const MockedOpenAIProvider = vi.mocked(OpenAIProvider);
const MockedOllamaProvider = vi.mocked(OllamaProvider);

describe('LlmGateway', () => {
    let gateway: LlmGateway;
    let mockSelector: LlmSelectorService;
    let mockOpenAIProvider: any;
    let mockOllamaProvider: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockSelector = new LlmSelectorService();

        mockOpenAIProvider = {
            invoke: vi.fn()
        };

        mockOllamaProvider = {
            invoke: vi.fn()
        };

        MockedOpenAIProvider.mockImplementation(() => mockOpenAIProvider);
        MockedOllamaProvider.mockImplementation(() => mockOllamaProvider);

        gateway = new LlmGateway(mockSelector, mockOpenAIProvider, mockOllamaProvider);
    });

    it('should route fast-chat requests to Ollama provider', async () => {
        const messages = [{ role: 'user', content: 'Hello' }];
        const expectedResponse = { content: 'Response from Ollama', usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 } };

        mockOllamaProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke('fast-chat', messages);

        expect(response).toBe(expectedResponse);
        expect(mockOllamaProvider.invoke).toHaveBeenCalledWith(messages, { model: 'phi3' });
        expect(mockOpenAIProvider.invoke).not.toHaveBeenCalled();
    });

    it('should route reasoning requests to OpenAI provider', async () => {
        const messages = [{ role: 'user', content: 'Solve this complex problem' }];
        const expectedResponse = { content: 'Response from OpenAI', usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 } };

        mockOpenAIProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke('reasoning', messages);

        expect(response).toBe(expectedResponse);
        expect(mockOpenAIProvider.invoke).toHaveBeenCalledWith(messages, { model: 'gpt-4o' });
        expect(mockOllamaProvider.invoke).not.toHaveBeenCalled();
    });

    it('should route embedding requests to Ollama provider', async () => {
        const messages = [{ role: 'user', content: 'Generate embeddings' }];
        const expectedResponse = { content: 'Embedding response', usage: { promptTokens: 3, completionTokens: 0, totalTokens: 3 } };

        mockOllamaProvider.invoke.mockResolvedValueOnce(expectedResponse);

        const response = await gateway.invoke('embedding', messages);

        expect(response).toBe(expectedResponse);
        expect(mockOllamaProvider.invoke).toHaveBeenCalledWith(messages, { model: 'nomic-embed-text' });
        expect(mockOpenAIProvider.invoke).not.toHaveBeenCalled();
    });

    it('should merge custom options with model from selector', async () => {
        const messages = [{ role: 'user', content: 'Test' }];
        const options = { temperature: 0.5, maxTokens: 100 };
        const expectedResponse = { content: 'Response', usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 } };

        mockOpenAIProvider.invoke.mockResolvedValueOnce(expectedResponse);

        await gateway.invoke('reasoning', messages, options);

        expect(mockOpenAIProvider.invoke).toHaveBeenCalledWith(messages, {
            ...options,
            model: 'gpt-4o'
        });
    });

    it('should throw error for unsupported provider', async () => {
        // Mock selector to return unsupported provider
        const spyPickModel = vi.spyOn(mockSelector, 'pickModel').mockReturnValueOnce({
            provider: 'unsupported',
            model: 'some-model'
        });

        const messages = [{ role: 'user', content: 'Test' }];

        await expect(gateway.invoke('fast-chat' as any, messages)).rejects.toThrow('Unsupported LLM provider: unsupported');

        spyPickModel.mockRestore();
    });

    it('should return correct provider instance', () => {
        const openaiProvider = gateway.getProvider('reasoning');
        const ollamaProvider = gateway.getProvider('fast-chat');

        expect(openaiProvider).toBe(mockOpenAIProvider);
        expect(ollamaProvider).toBe(mockOllamaProvider);
    });

    it('should return correct model spec', () => {
        const reasoningSpec = gateway.getModelSpec('reasoning');
        const fastChatSpec = gateway.getModelSpec('fast-chat');
        const embeddingSpec = gateway.getModelSpec('embedding');

        expect(reasoningSpec).toEqual({ provider: 'openai', model: 'gpt-4o' });
        expect(fastChatSpec).toEqual({ provider: 'ollama', model: 'phi3' });
        expect(embeddingSpec).toEqual({ provider: 'ollama', model: 'nomic-embed-text' });
    });

    it('should throw error when getting unsupported provider', () => {
        // Mock selector to return unsupported provider
        const spyPickModel = vi.spyOn(mockSelector, 'pickModel').mockReturnValueOnce({
            provider: 'unsupported',
            model: 'some-model'
        });

        expect(() => gateway.getProvider('fast-chat' as any)).toThrow('Unsupported LLM provider: unsupported');

        spyPickModel.mockRestore();
    });
});
