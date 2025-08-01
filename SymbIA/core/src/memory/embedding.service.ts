import { encoding_for_model } from '@dqbd/tiktoken';
import { LlmGateway } from '../llm/LlmGateway.js';
import { LlmSetService } from '../llm/llm-set.service.js';
import type { LlmSetConfig } from '../types/llm.js';

export class EmbeddingService {
    constructor(
        private llmGateway: LlmGateway,
        private llmSetService: LlmSetService
    ) { }

    async generateEmbedding(text: string, llmSetId?: string): Promise<number[]> {
        // Get LLM set configuration
        const llmSetConfig = await this.getLlmSetForEmbedding(llmSetId);
        if (!llmSetConfig) {
            throw new Error('No suitable LLM set found for embedding');
        }

        const embeddingModel = llmSetConfig.models.embedding;
        if (!embeddingModel) {
            throw new Error(`No embedding model found in LLM set '${llmSetConfig.id}'`);
        }

        try {
            // For now, return a mock embedding until proper embedding support is added
            const mockEmbedding = this.generateMockEmbedding(text);
            return mockEmbedding;
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
        } catch {
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

    /**
     * Generate a mock embedding for development purposes
     * TODO: Replace with actual embedding generation
     */
    private generateMockEmbedding(text: string): number[] {
        // Create a simple hash-based mock embedding with 1536 dimensions (same as OpenAI)
        const dimensions = 1536;
        const embedding: number[] = [];

        // Use text content to generate deterministic but varied values
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = ((hash << 5) - hash + text.charCodeAt(i)) & 0xffffffff;
        }

        // Generate pseudo-random values based on the hash
        for (let i = 0; i < dimensions; i++) {
            const seed = (hash + i * 37) & 0xffffffff;
            const value = (seed / 0xffffffff - 0.5) * 2; // Normalize to [-1, 1]
            embedding.push(value);
        }

        // Normalize the vector
        const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
        return embedding.map(val => val / magnitude);
    }
}
