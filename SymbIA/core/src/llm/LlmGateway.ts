import { injectable, inject } from 'tsyringe';
import type { LlmSetConfig, LlmRequest, LlmResponse, ModelSpec, StreamProgressCallback } from '@symbia/interfaces';
import { LlmSetService } from './llm-set.service.js';
import { OpenAIProvider } from './providers/openai.js';
import { OllamaProvider } from './providers/ollama.js';

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

    async invokeAsync(
        llmSetConfig: LlmSetConfig,
        purpose: 'reasoning' | 'reasoningHeavy' | 'chat' | 'codegen' | 'embedding',
        messages: LlmRequest['messages'],
        streamCallback: StreamProgressCallback,
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

export async function generateChatTitle(llmGateway: LlmGateway, llmSetConfig: LlmSetConfig, messages: LlmRequest['messages']): Promise<string> {
    // Prompt para gerar título
    const prompt = [
        ...messages,
        {
            role: 'system',
            content: 'Gere um título curto (máx. 60 caracteres) para este chat, baseado na primeira mensagem do usuário. Responda apenas com o título.'
        }
    ];
    const response = await llmGateway.invoke(llmSetConfig, 'reasoning', prompt);
    // Extrai o texto do título
    return response.content?.slice(0, 60) || 'Novo Chat';
}
