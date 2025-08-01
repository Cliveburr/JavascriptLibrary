import type { LlmRequest, LlmResponse, LlmSetModel } from '../types/llm.js';
import { OpenAIProvider } from './providers/openai.js';
import { OllamaProvider } from './providers/ollama.js';

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
        fristCallback: (content: string) => void,
        chunkCallback: (content: string) => void,
        endCallback?: (content: string) => Promise<void>,
        options?: Partial<LlmRequest>
    ): Promise<LlmResponse> {
        const requestOptions = {
            ...options,
            model: modelSpec.model,
            stream: true
        };
        switch (modelSpec.provider) {
            case 'openai':
                return this.openaiProvider.invokeAsync(messages, requestOptions, fristCallback, chunkCallback, endCallback);

            case 'ollama':
                return this.ollamaProvider.invokeAsync(messages, requestOptions, fristCallback, chunkCallback, endCallback);

            default:
                throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

}
