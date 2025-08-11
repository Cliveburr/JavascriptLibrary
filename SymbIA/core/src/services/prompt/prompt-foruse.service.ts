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

    getActualPromptSetForUse(): PromptSetForUse {

        // se tiver cache já entregar

        // pegar PromptConfiguration o actualPromptSetId

        // pegar o PromptSet do id

        // passar para o PromptSetForUse fazendo EVAL do campo contextConvert

        // setar cache e retornar
    }

    cleanActualPromptSetForUse(): void {
        delete this.acualPromptSetForUseCache;
    }

    getPromptSetForUse(promptSetId: ObjectId): PromptSetForUse {

        // pegar o PromptSet do promptSetId

        // passar para o PromptSetForUse fazendo EVAL do campo contextConvert
    }
}