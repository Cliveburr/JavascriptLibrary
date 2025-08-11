import { v6 } from 'uuid';
import { ChatContext, ChatContextReplyResponse, ChatIterationLLMRequest } from '../../entities';
import { BodyJsonParser, MessageQueue, createBodyJsonStreamParser } from '../../helpers';
import { LlmGateway, LlmSetModel } from '../../llm';
import { IStreamChatContext } from '../../thought/stream-chat';
import { ActionHandler } from '../act-defs';
import { replyPromptV0 } from './reply-prompt-v0';
import { filterContextForRequest } from '../../helpers/filterContextForRequest';

interface ReplyContext {
    chatCtx: IStreamChatContext;
    request: ChatIterationLLMRequest;
    parser: BodyJsonParser,
    messageQueue: MessageQueue<string>;
}

export class ReplyAction implements ActionHandler {
    readonly name = "Reply";

    async execute(chatCtx: IStreamChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running Reply action...");

        const ctx = await this.prepareRequest(chatCtx);

        await this.callLLM(ctx, llmGateway);

        await chatCtx.sendCompleteMessage();

        chatCtx.finalizeIteration = true;
        console.log("End of Reply!");
    }

    private async prepareRequest(chatCtx: IStreamChatContext): Promise<ReplyContext> {

        await chatCtx.sendPrepareMessage('reply');

        const systemPrompt = replyPromptV0
            .replace('{{userLanguage}}', chatCtx.user.reponseLanguage);

        const request: ChatIterationLLMRequest = {
            requestId: `${chatCtx.chat._id}_${v6({}, undefined, Date.now())}`,
            promptType: 'reply',
            llmSetModel: {
                provider: chatCtx.llmSetConfig.models.fastChat.provider,
                model: chatCtx.llmSetConfig.models.fastChat.model,
                temperature: 0.7,
                maxTokens: 200
            },
            systemPrompt,
            contexts: [],
            startedDate: new Date()
        };

        const messageQueue = new MessageQueue<string>(chatCtx.sendStreamMessage.bind(chatCtx));

        return {
            chatCtx,
            request,
            parser: createBodyJsonStreamParser(messageQueue.add),
            messageQueue
        };
    }

    private async callLLM(ctx: ReplyContext, llmGateway: LlmGateway): Promise<void> {

        const messages = filterContextForRequest(ctx.chatCtx.chat,
            ctx.request.systemPrompt
        );

        const response = await llmGateway.invokeAsync(
            ctx.request.llmSetModel,
            messages,
            ctx.parser.process,
            {
                temperature: ctx.request.llmSetModel.temperature,
                maxTokens: ctx.request.llmSetModel.maxTokens
            }
        );
        ctx.request.llmResponse = response.content;

        if (response.usage) {
            ctx.request.promptTokens = response.usage.promptTokens;
            ctx.request.completionTokens = response.usage.completionTokens;
            ctx.request.totalTokens = response.usage.totalTokens;
            ctx.chatCtx.iteration.promptTokens = (ctx.chatCtx.iteration.promptTokens || 0) + ctx.request.promptTokens;
            ctx.chatCtx.iteration.completionTokens = (ctx.chatCtx.iteration.completionTokens || 0) + ctx.request.completionTokens;
            ctx.chatCtx.iteration.totalTokens = (ctx.chatCtx.iteration.totalTokens || 0) + ctx.request.totalTokens;
            ctx.chatCtx.chat.promptTokens = (ctx.chatCtx.chat.promptTokens || 0) + ctx.request.promptTokens;
            ctx.chatCtx.chat.completionTokens = (ctx.chatCtx.chat.completionTokens || 0) + ctx.request.completionTokens;
            ctx.chatCtx.chat.totalTokens = (ctx.chatCtx.chat.totalTokens || 0) + ctx.request.totalTokens;
        }

        this.processResponse(ctx, response.content);
    }

    private processResponse(ctx: ReplyContext, content: string): void {
        const parseResult = ctx.parser.end(content);
        if (!parseResult) {
            throw 'Invalid llmResponse for reflection: \n' + content;
        }

        try {
            const response = JSON.parse(parseResult.JSON) as ChatContextReplyResponse;
            const context: ChatContext = {
                type: 'reply_response',
                replyResponse: response
            };
            ctx.request.contexts.push(context);
        } catch {
            throw 'JSON parse error: ' + parseResult.JSON;
        }
    }
}

// Export instance for registry
export const replyAction = new ReplyAction();
