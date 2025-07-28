import { describe, it, expect } from 'vitest';
import type {
    LlmSet,
    ModelSpec,
    LlmProvider,
    LlmRequest,
    LlmResponse
} from '../src/llm.js';

describe('LLM types', () => {
    it('should have correct LlmSet type', () => {
        const fastChat: LlmSet = 'fast-chat';
        const reasoning: LlmSet = 'reasoning';
        const embedding: LlmSet = 'embedding';

        expect(fastChat).toBe('fast-chat');
        expect(reasoning).toBe('reasoning');
        expect(embedding).toBe('embedding');
    });

    it('should have correct ModelSpec interface structure', () => {
        const modelSpec: ModelSpec = {
            provider: 'openai',
            model: 'gpt-4o',
        };

        expect(modelSpec.provider).toBe('openai');
        expect(modelSpec.model).toBe('gpt-4o');
    });

    it('should have correct LlmProvider interface structure', () => {
        const provider: LlmProvider = {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            apiKey: 'sk-test123',
        };

        expect(provider.name).toBe('OpenAI');
        expect(provider.baseUrl).toBe('https://api.openai.com/v1');
        expect(provider.apiKey).toBe('sk-test123');
    });

    it('should have correct LlmProvider interface structure without optional fields', () => {
        const provider: LlmProvider = {
            name: 'Ollama',
        };

        expect(provider.name).toBe('Ollama');
        expect(provider.baseUrl).toBeUndefined();
        expect(provider.apiKey).toBeUndefined();
    });

    it('should have correct LlmRequest interface structure', () => {
        const request: LlmRequest = {
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: 'Hello!' },
            ],
            model: 'gpt-4o',
            temperature: 0.7,
            maxTokens: 1000,
        };

        expect(request.messages).toHaveLength(2);
        expect(request.messages[0].role).toBe('system');
        expect(request.messages[1].role).toBe('user');
        expect(request.model).toBe('gpt-4o');
        expect(request.temperature).toBe(0.7);
        expect(request.maxTokens).toBe(1000);
    });

    it('should have correct LlmRequest interface structure with only required fields', () => {
        const request: LlmRequest = {
            messages: [
                { role: 'user', content: 'Hello!' },
            ],
            model: 'phi3',
        };

        expect(request.messages).toHaveLength(1);
        expect(request.model).toBe('phi3');
        expect(request.temperature).toBeUndefined();
        expect(request.maxTokens).toBeUndefined();
    });

    it('should have correct LlmResponse interface structure', () => {
        const response: LlmResponse = {
            content: 'Hello! How can I help you today?',
            usage: {
                promptTokens: 10,
                completionTokens: 15,
                totalTokens: 25,
            },
        };

        expect(response.content).toBe('Hello! How can I help you today?');
        expect(response.usage?.promptTokens).toBe(10);
        expect(response.usage?.completionTokens).toBe(15);
        expect(response.usage?.totalTokens).toBe(25);
    });

    it('should have correct LlmResponse interface structure without usage', () => {
        const response: LlmResponse = {
            content: 'Hello! How can I help you today?',
        };

        expect(response.content).toBe('Hello! How can I help you today?');
        expect(response.usage).toBeUndefined();
    });
});
