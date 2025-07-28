import { injectable, inject } from 'tsyringe';
import type { LlmSet, LlmRequest, LlmResponse } from '@symbia/interfaces';
import { LlmSelectorService } from './selector';
import { OpenAIProvider } from './providers/openai';
import { OllamaProvider } from './providers/ollama';

@injectable()
export class LlmGateway {
    constructor(
        @inject(LlmSelectorService) private selector: LlmSelectorService,
        @inject(OpenAIProvider) private openaiProvider: OpenAIProvider,
        @inject(OllamaProvider) private ollamaProvider: OllamaProvider
    ) { }

    async invoke(
        set: LlmSet,
        messages: LlmRequest['messages'],
        options?: Partial<LlmRequest>
    ): Promise<LlmResponse> {
        const modelSpec = this.selector.pickModel(set);

        // Merge model from selector with options
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

    getProvider(set: LlmSet) {
        const modelSpec = this.selector.pickModel(set);

        switch (modelSpec.provider) {
            case 'openai':
                return this.openaiProvider;

            case 'ollama':
                return this.ollamaProvider;

            default:
                throw new Error(`Unsupported LLM provider: ${modelSpec.provider}`);
        }
    }

    getModelSpec(set: LlmSet) {
        return this.selector.pickModel(set);
    }
}
