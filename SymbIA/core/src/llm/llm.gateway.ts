import type { OpenAIProvider } from './providers/openai';
import type { OllamaProvider } from './providers/ollama';
import type { LlmSetModel, LlmResponse, LlmSetConfig, EmbeddingResponse, EmbeddingRequest, LlmRequestMessage, LlmRequestOptions, LlmRequest } from './llm.types';

export class LlmGateway {

    constructor(
        private openaiProvider: OpenAIProvider,
        private ollamaProvider: OllamaProvider
    ) {
    }

    async invoke(modelSpec: LlmSetModel, messages: LlmRequestMessage[], options?: LlmRequestOptions): Promise<LlmResponse> {
        const request: LlmRequest = {
            model: modelSpec.model,
            messages,
            options
        };
        switch (modelSpec.provider) {
            case 'openai': return this.openaiProvider.invoke(request);
            case 'ollama': return this.ollamaProvider.invoke(request);
            default: throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    async invokeAsync(modelSpec: LlmSetModel, messages: LlmRequestMessage[], streamCallback: (content: string) => void, options?: LlmRequestOptions): Promise<LlmResponse> {
        const request: LlmRequest = {
            model: modelSpec.model,
            messages,
            options
        };
        switch (modelSpec.provider) {
            case 'openai': return this.openaiProvider.invokeAsync(request, streamCallback);
            case 'ollama': return this.ollamaProvider.invokeAsync(request, streamCallback);
            default: throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    async generateEmbedding(llmSetConfig: LlmSetConfig, texts: Array<string>): Promise<EmbeddingResponse> {
        const embeddingModel = llmSetConfig.models.embedding;
        const requestOptions: EmbeddingRequest = {
            input: texts,
            model: embeddingModel.model,
        };
        switch (embeddingModel.provider) {
            case 'openai': return this.openaiProvider.generateEmbedding(requestOptions);
            case 'ollama': return this.ollamaProvider.generateEmbedding(requestOptions);
            default: throw new Error(`Unsupported LLM provider for embeddings: ${embeddingModel.provider}`);
        }
    }
}
