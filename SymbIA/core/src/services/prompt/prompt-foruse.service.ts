import { ObjectId } from 'mongodb';
import { PromptService } from './prompt.service';
import { ChatEntity, UserEntity } from '../../entities';
import { LlmRequestMessage, LlmRequestOptions } from '../../llm';

export class PromptSetForUse {

    constructor(
        public promptSetId: ObjectId,
        public isForTunning: boolean,
        public prompts: Array<{
            name: string;
            systemPrompt: string;
            buildContext: (requestContext: any, requestPromptName: string) => string;
            temperature?: number;
            maxTokens?: number;
        }>
    ) {
    }

    getMessagesFor(
        chat: ChatEntity,
        user: UserEntity,
        promptName: string
    ): { llmOptions: LlmRequestOptions, messages: LlmRequestMessage[]; } {

        const prompt = this.prompts
            .find(p => p.name == promptName);
        if (!prompt) {
            throw `Missing prompt name '${promptName} on PromptSetId: ${this.promptSetId}'`;
        }

        const messages: LlmRequestMessage[] = [
            {
                role: 'system',
                content: prompt.systemPrompt
                    .replace('{{userLanguage}}', user.reponseLanguage)
            }
        ];

        for (let iteration of chat.iterations) {
            messages.push({ role: 'user', content: iteration.userMessage });
            for (let request of iteration.requests) {
                messages.push({ role: 'assistant', content: prompt.buildContext(request.forContext, request.promptName) });
            }
        }

        return {
            llmOptions: {
                temperature: prompt.temperature,
                maxTokens: prompt.maxTokens
            }, messages
        };
    }
}


export class PromptForUseService {

    private acualPromptSetForUseCache?: PromptSetForUse;

    constructor(
        private promptService: PromptService
    ) {
    }

    async getActualPromptSetForUse(): Promise<PromptSetForUse> {
        // se tiver cache já entregar
        if (this.acualPromptSetForUseCache) {
            return this.acualPromptSetForUseCache;
        }

        // pegar PromptConfiguration o actualPromptSetId
        const promptConfiguration = await this.promptService.getPromptConfiguration();
        if (!promptConfiguration) {
            throw new Error('No PromptConfiguration found');
        }

        // pegar o PromptSet do id
        const promptSet = await this.promptService.getPromptSet(promptConfiguration.actualPromptSetId);
        if (!promptSet) {
            throw new Error(`PromptSet not found for id: ${promptConfiguration.actualPromptSetId}`);
        }

        // passar para o PromptSetForUse fazendo EVAL do campo contextConvert
        const promptSetForUse = this.convertToPromptSetForUse(promptSet);

        // setar cache e retornar
        this.acualPromptSetForUseCache = promptSetForUse;
        return promptSetForUse;
    }

    cleanActualPromptSetForUse(): void {
        delete this.acualPromptSetForUseCache;
    }

    async getPromptSetForUse(promptSetId: ObjectId): Promise<PromptSetForUse> {
        // pegar o PromptSet do promptSetId
        const promptSet = await this.promptService.getPromptSet(promptSetId);
        if (!promptSet) {
            throw new Error(`PromptSet not found for id: ${promptSetId}`);
        }

        // passar para o PromptSetForUse fazendo EVAL do campo contextConvert
        return this.convertToPromptSetForUse(promptSet);
    }

    private convertToPromptSetForUse(promptSet: any): PromptSetForUse {
        const prompts = promptSet.prompts.map((prompt: any) => ({
            name: prompt.name,
            systemPrompt: prompt.systemPrompt,
            buildContext: this.evaluateContextConvert(prompt.contextConvert),
            temperature: prompt.temperature,
            maxTokens: prompt.maxTokens
        }));

        return new PromptSetForUse(
            promptSet._id,
            promptSet.isForTunning,
            prompts
        );
    }

    private evaluateContextConvert(contextConvert: string): (requestContext: any, requestPromptName: string) => string {
        try {
            // Cria uma função a partir do código string usando eval
            // O código deve retornar uma função que aceita (requestContext, requestPromptName) e retorna string
            return eval(`(${contextConvert})`);
        } catch (error) {
            console.error('Error evaluating contextConvert:', error);
            // Fallback: retorna uma função que simplesmente converte o contexto em string
            return (requestContext: any, requestPromptName: string) => {
                return JSON.stringify(requestContext);
            };
        }
    }
}