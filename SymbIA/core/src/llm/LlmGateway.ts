import { injectable, inject } from 'tsyringe';
import type { LlmSetConfig, LlmRequest, LlmResponse, ModelSpec } from '@symbia/interfaces';
import { LlmSetService } from './llm-set.service';
import { OpenAIProvider } from './providers/openai';
import { OllamaProvider } from './providers/ollama';

@injectable()
export class LlmGateway {
    constructor(
        @inject(LlmSetService) private llmSetService: LlmSetService,
        @inject(OpenAIProvider) private openaiProvider: OpenAIProvider,
        @inject(OllamaProvider) private ollamaProvider: OllamaProvider
    ) { }

    async invoke(
        llmSetConfig: LlmSetConfig,
        purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding',
        messages: LlmRequest['messages'],
        options?: Partial<LlmRequest>
    ): Promise<LlmResponse> {
        const modelSpec = this.llmSetService.getModelSpecWithFallback(llmSetConfig, purpose);

        if (!modelSpec) {
            throw new Error(`No model found for purpose '${purpose}' in LLM set '${llmSetConfig.id}'`);
        }

        // Merge model from llmSetConfig with options
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

    getProvider(llmSetConfig: LlmSetConfig, purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding') {
        const modelSpec = this.llmSetService.getModelSpecWithFallback(llmSetConfig, purpose);

        if (!modelSpec) {
            throw new Error(`No model found for purpose '${purpose}' in LLM set '${llmSetConfig.id}'`);
        }

        switch (modelSpec.provider) {
            case 'openai':
                return this.openaiProvider;

            case 'ollama':
                return this.ollamaProvider;

            default:
                throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    getModelSpec(llmSetConfig: LlmSetConfig, purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding'): ModelSpec | null {
        return this.llmSetService.getModelSpecWithFallback(llmSetConfig, purpose);
    }
}
