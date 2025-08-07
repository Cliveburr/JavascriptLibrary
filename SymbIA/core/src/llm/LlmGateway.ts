import type { EmbeddingRequest, EmbeddingResponse, LlmRequest, LlmResponse, LlmSetConfig, LlmSetModel } from '../types/llm';
import { OpenAIProvider } from './providers/openai';
import { OllamaProvider } from './providers/ollama';

export class LlmGateway {
    constructor(
        private openaiProvider: OpenAIProvider,
        private ollamaProvider: OllamaProvider
    ) { }

    async invoke(
        modelSpec: LlmSetModel,
        messages: LlmRequest['messages'],
        options?: Partial<LlmRequest>
    ): Promise<LlmResponse> {
        const requestOptions = {
            ...options,
            model: modelSpec.model,
        };
        switch (modelSpec.provider) {
            case 'openai':
                return this.openaiProvider.invoke(messages, requestOptions);

            case 'ollama':
                return this.ollamaProvider.invoke(messages, requestOptions);

            default:
                throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    async invokeAsync(
        modelSpec: LlmSetModel,
        messages: LlmRequest['messages'],
        streamCallback: (content: string) => void,
        options?: Partial<LlmRequest>
    ): Promise<LlmResponse> {
        const requestOptions = {
            ...options,
            model: modelSpec.model,
            stream: true
        };
        switch (modelSpec.provider) {
            case 'openai':
                return this.openaiProvider.invokeAsync(messages, requestOptions, streamCallback);

            case 'ollama':
                return this.ollamaProvider.invokeAsync(messages, requestOptions, streamCallback);

            default:
                throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    async generateEmbedding(
        llmSetConfig: LlmSetConfig,
        texts: Array<string>
    ): Promise<EmbeddingResponse> {

        const embeddingModel = llmSetConfig.models.embedding;
        const requestOptions: EmbeddingRequest = {
            input: texts,
            model: embeddingModel.model,
        };

        switch (embeddingModel.provider) {
            case 'openai':
                return this.openaiProvider.generateEmbedding(requestOptions);

            case 'ollama':
                return this.ollamaProvider.generateEmbedding(requestOptions);

            default:
                throw new Error(`Unsupported LLM provider for embeddings: ${embeddingModel.provider}`);
        }
    }
}
