import { injectable, inject } from 'tsyringe';
import { encoding_for_model } from '@dqbd/tiktoken';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';
import type { LlmSetConfig } from '@symbia/interfaces';

@injectable()
export class EmbeddingService {
    constructor(
        @inject(LlmGateway) private llmGateway: LlmGateway,
        @inject(LlmSetService) private llmSetService: LlmSetService
    ) { }

    async generateEmbedding(text: string, llmSetId?: string): Promise<number[]> {
        // Get LLM set configuration
        const llmSetConfig = await this.getLlmSetForEmbedding(llmSetId);
        if (!llmSetConfig) {
            throw new Error('No suitable LLM set found for embedding');
        }

        const modelSpec = this.llmGateway.getModelSpec(llmSetConfig, 'embedding');
        if (!modelSpec) {
            throw new Error(`No embedding model found in LLM set '${llmSetConfig.id}'`);
        }

        try {
            const provider = this.llmGateway.getProvider(llmSetConfig, 'embedding');

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
    async generateEmbeddings(texts: string[], llmSetId?: string): Promise<number[][]> {
        const embeddings: number[][] = [];

        for (const text of texts) {
            const embedding = await this.generateEmbedding(text, llmSetId);
            embeddings.push(embedding);
        }

        return embeddings;
    }

    /**
     * Get LLM set configuration for embedding with fallback logic
     */
    private async getLlmSetForEmbedding(llmSetId?: string): Promise<LlmSetConfig | null> {
        // If a specific LLM set ID is provided, try to get it first
        if (llmSetId) {
            const requestedSet = await this.llmSetService.getLlmSetById(llmSetId);
            if (requestedSet && requestedSet.models.embedding) {
                return requestedSet;
            }
        }

        // Fallback logic - try to find a suitable LLM set with embedding support
        const allSets = await this.llmSetService.loadLlmSets();
        return allSets.find(set => set.models.embedding) || null;
    }
}
