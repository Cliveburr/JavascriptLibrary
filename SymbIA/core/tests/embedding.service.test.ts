import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EmbeddingService } from '../src/memory/embedding.service';
import { LlmGateway } from '../src/llm/LlmGateway';
import { container } from 'tsyringe';

// Mock the LlmGateway
vi.mock('../src/llm/LlmGateway');

// Mock tiktoken
vi.mock('@dqbd/tiktoken', () => ({
    encoding_for_model: vi.fn(() => ({
        encode: vi.fn((text: string) => new Array(Math.ceil(text.length / 4))),
        free: vi.fn(),
    })),
}));

describe('EmbeddingService', () => {
    let embeddingService: EmbeddingService;
    let mockLlmGateway: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup mock LlmGateway
        mockLlmGateway = {
            getModelSpec: vi.fn(),
            getProvider: vi.fn(),
        };

        // Register mock in container
        container.registerInstance(LlmGateway, mockLlmGateway);

        embeddingService = new EmbeddingService(mockLlmGateway);
    });

    describe('generateEmbedding', () => {
        it('should generate embedding successfully with Ollama provider', async () => {
            const text = 'Test text for embedding';
            const expectedEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5];

            // Mock model spec
            mockLlmGateway.getModelSpec.mockReturnValue({
                provider: 'ollama',
                model: 'nomic-embed-text',
            });

            // Mock provider with generateEmbedding method
            const mockProvider = {
                generateEmbedding: vi.fn().mockResolvedValue({
                    embedding: expectedEmbedding,
                    usage: {
                        promptTokens: 10,
                        totalTokens: 10,
                    },
                }),
            };

            mockLlmGateway.getProvider.mockReturnValue(mockProvider);

            const result = await embeddingService.generateEmbedding(text);

            expect(mockLlmGateway.getModelSpec).toHaveBeenCalledWith('embedding');
            expect(mockLlmGateway.getProvider).toHaveBeenCalledWith('embedding');
            expect(mockProvider.generateEmbedding).toHaveBeenCalledWith({
                text,
                model: 'nomic-embed-text',
            });
            expect(result).toEqual(expectedEmbedding);
        });

        it('should throw error if provider does not support embeddings', async () => {
            const text = 'Test text for embedding';

            // Mock model spec
            mockLlmGateway.getModelSpec.mockReturnValue({
                provider: 'unsupported',
                model: 'some-model',
            });

            // Mock provider without generateEmbedding method
            const mockProvider = {
                invoke: vi.fn(),
            };

            mockLlmGateway.getProvider.mockReturnValue(mockProvider);

            await expect(embeddingService.generateEmbedding(text)).rejects.toThrow(
                'Provider unsupported does not support embeddings'
            );
        });

        it('should throw error if embedding generation fails', async () => {
            const text = 'Test text for embedding';

            // Mock model spec
            mockLlmGateway.getModelSpec.mockReturnValue({
                provider: 'ollama',
                model: 'nomic-embed-text',
            });

            // Mock provider with generateEmbedding method that throws
            const mockProvider = {
                generateEmbedding: vi.fn().mockRejectedValue(new Error('API Error')),
            };

            mockLlmGateway.getProvider.mockReturnValue(mockProvider);

            await expect(embeddingService.generateEmbedding(text)).rejects.toThrow(
                'Failed to generate embedding: API Error'
            );
        });
    });

    describe('countTokens', () => {
        it('should count tokens using tiktoken', () => {
            const text = 'Hello world, this is a test';
            const tokenCount = embeddingService.countTokens(text);

            // With our mock, it should return ceil(text.length / 4)
            expect(tokenCount).toBe(Math.ceil(text.length / 4));
        });
    });

    describe('splitTextByTokens', () => {
        it('should split text into chunks within token limits', () => {
            const text = 'First sentence. Second sentence. Third sentence. Fourth sentence.';
            const maxTokens = 10; // Small limit to force splitting

            const chunks = embeddingService.splitTextByTokens(text, maxTokens);

            expect(chunks.length).toBeGreaterThan(1);

            // Each chunk should be within token limit
            chunks.forEach(chunk => {
                const tokenCount = embeddingService.countTokens(chunk);
                expect(tokenCount).toBeLessThanOrEqual(maxTokens);
            });
        });

        it('should handle text with no sentence breaks', () => {
            const text = 'This is a very long text without sentence breaks that should still be handled properly';
            const maxTokens = 5;

            const chunks = embeddingService.splitTextByTokens(text, maxTokens);

            expect(chunks.length).toBeGreaterThanOrEqual(1);
        });

        it('should return single chunk if text is within limit', () => {
            const text = 'Short text.';
            const maxTokens = 1000;

            const chunks = embeddingService.splitTextByTokens(text, maxTokens);

            // The function splits by sentence delimiters and removes them
            expect(chunks).toEqual(['Short text']);
        });
    });

    describe('generateEmbeddings', () => {
        it('should generate embeddings for multiple texts', async () => {
            const texts = ['First text', 'Second text', 'Third text'];
            const expectedEmbeddings = [
                [0.1, 0.2, 0.3],
                [0.4, 0.5, 0.6],
                [0.7, 0.8, 0.9],
            ];

            // Mock model spec
            mockLlmGateway.getModelSpec.mockReturnValue({
                provider: 'ollama',
                model: 'nomic-embed-text',
            });

            // Mock provider with generateEmbedding method
            const mockProvider = {
                generateEmbedding: vi.fn()
                    .mockResolvedValueOnce({ embedding: expectedEmbeddings[0] })
                    .mockResolvedValueOnce({ embedding: expectedEmbeddings[1] })
                    .mockResolvedValueOnce({ embedding: expectedEmbeddings[2] }),
            };

            mockLlmGateway.getProvider.mockReturnValue(mockProvider);

            const results = await embeddingService.generateEmbeddings(texts);

            expect(results).toEqual(expectedEmbeddings);
            expect(mockProvider.generateEmbedding).toHaveBeenCalledTimes(3);

            texts.forEach((text, index) => {
                expect(mockProvider.generateEmbedding).toHaveBeenNthCalledWith(index + 1, {
                    text,
                    model: 'nomic-embed-text',
                });
            });
        });

        it('should handle empty array', async () => {
            const texts: string[] = [];

            const results = await embeddingService.generateEmbeddings(texts);

            expect(results).toEqual([]);
        });
    });
});
