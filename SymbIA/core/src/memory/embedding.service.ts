import { injectable, inject } from 'tsyringe';
import { encoding_for_model } from '@dqbd/tiktoken';
import { LlmGateway } from '../llm/LlmGateway';

@injectable()
export class EmbeddingService {
    constructor(
        @inject(LlmGateway) private llmGateway: LlmGateway
    ) { }

    async generateEmbedding(text: string): Promise<number[]> {
        const modelSpec = this.llmGateway.getModelSpec('embedding');

        try {
            const provider = this.llmGateway.getProvider('embedding');

            // Check if provider has embedding method
            if ('generateEmbedding' in provider && typeof provider.generateEmbedding === 'function') {
                const response = await provider.generateEmbedding({
                    text,
                    model: modelSpec.model,
                });
                return response.embedding;
            } else {
                throw new Error(`Provider ${modelSpec.provider} does not support embeddings`);
            }
        } catch (error) {
            throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * Calculate the number of tokens in a text string
     * This helps estimate embedding costs and manage text size
     */
    countTokens(text: string, model: string = 'text-embedding-ada-002'): number {
        try {
            const encoder = encoding_for_model(model as any);
            const tokens = encoder.encode(text);
            encoder.free();
            return tokens.length;
        } catch (error) {
            // Fallback: rough estimation (1 token ≈ 4 characters)
            return Math.ceil(text.length / 4);
        }
    }

    /**
     * Split text into chunks that fit within token limits
     * Useful for processing large documents
     */
    splitTextByTokens(text: string, maxTokens: number = 8000, model: string = 'text-embedding-ada-002'): string[] {
        const chunks: string[] = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        let currentChunk = '';

        for (const sentence of sentences) {
            const testChunk = currentChunk + (currentChunk ? '. ' : '') + sentence.trim();
            const tokenCount = this.countTokens(testChunk, model);

            if (tokenCount > maxTokens && currentChunk) {
                // Add current chunk and start new one
                chunks.push(currentChunk);
                currentChunk = sentence.trim();
            } else {
                currentChunk = testChunk;
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    /**
     * Generate embeddings for multiple text chunks
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const embeddings: number[][] = [];

        for (const text of texts) {
            const embedding = await this.generateEmbedding(text);
            embeddings.push(embedding);
        }

        return embeddings;
    }
}
