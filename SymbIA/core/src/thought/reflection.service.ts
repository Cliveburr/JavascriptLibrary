import { MessageQueue, createBodyJsonStreamParser, parseMessageForPrompt } from '../helpers';
import { LlmGateway, LlmRequestMessage } from '../llm';
import { ServiceRegistry } from '../services';
import { reflectionPromptV1 } from './reflection-prompts';
import { IStreamChatContext } from './stream-chat';

interface ReflectionContext {
    chatCtx: IStreamChatContext;
    message: Message;
    content: MessageReflectionModal;
    parser: { process: (chunk: string) => void, end: () => string; },
    messageQueue: MessageQueue<MessageReflectionModal>;
    action?: string;
}

interface PromptResult {
    action: 'Reply' | 'MemorySearch';
}

export class ReflectionService {
    constructor(
        private llmGateway: LlmGateway
    ) { }

    async reflectNextAction(chatCtx: IStreamChatContext): Promise<string | undefined> {
        console.log('Reflecting...');

        const ctx = await this.prepareMessage(chatCtx);

        await this.callLLM(ctx);

        await chatCtx.sendCompleteMessage(ctx.message);

        console.log('End of Reflection!');
        return ctx.action;
    }

    private async prepareMessage(chatCtx: IStreamChatContext): Promise<ReflectionContext> {

        await chatCtx.sendPrepareMessage('reflection');

        const messageQueue = new MessageQueue<MessageReflectionModal>(chatCtx.sendStreamMessage.bind(chatCtx));

        const onBody = (chunk: string): void => {
            content.content += chunk;
            messageQueue.add({
                content: chunk
            });
        };

        return {
            chatCtx,
            message,
            content,
            parser: createBodyJsonStreamParser(onBody),
            messageQueue
        };
    }

    private async callLLM(ctx: ReflectionContext): Promise<void> {

        const messages = this.getReflectionPrompt(ctx);

        const response = await this.llmGateway.invokeAsync(
            ctx.chatCtx.llmSetConfig.models.reasoningHeavy,
            messages,
            ctx.parser.process,
            {
                temperature: 0.2, // Low temperature for consistent decisions
                maxTokens: 200, // Short response expected
            }
        );
        const debugService = ServiceRegistry.getInstance().getOptional<DebugService>('DebugService');
        if (debugService) {
            debugService.addRequest(ctx.chatCtx.chatId, messages, response.content);
        }

        if (response.usage) {
            ctx.message.promptTokens = response.usage.promptTokens;
            ctx.message.completionTokens = response.usage.completionTokens;
        }

        ctx.action = this.parseResult(ctx);
    }

    private getReflectionPrompt(ctx: ReflectionContext): Array<LlmRequestMessage> {
        const history = ctx.chatCtx.messages
            .map(msg => parseMessageForPrompt(msg));

        const systemPrompt = reflectionPromptV1;

        return [
            { role: 'system', content: systemPrompt },
            ...history,
        ];
    }

    private parseResult(ctx: ReflectionContext): string | undefined {
        const resultJSON = ctx.parser.end();
        try {
            const result = JSON.parse(resultJSON) as PromptResult;
            return result.action;
        } catch {
            console.warn('JSON parse error: ' + resultJSON);
        }
    }
}
