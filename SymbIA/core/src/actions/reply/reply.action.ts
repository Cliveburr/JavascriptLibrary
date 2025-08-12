import type { ChatIterationLLMRequest } from '../../entities';
import type { LlmGateway } from '../../llm';
import type { ActionHandler } from '../act-defs';
import type { ThoughtContext } from '../../thought';
import { v6 } from 'uuid';
import { ParserResponse, MessageQueue, createBodyJsonStreamParser } from '../../helpers';

interface ReplyContext {
    thoughtCtx: ThoughtContext;
    request: ChatIterationLLMRequest;
    parser: ParserResponse,
    messageQueue: MessageQueue<string>;
}

interface ReplyResponseJSON {
}

export class ReplyAction implements ActionHandler {
    readonly name = "Reply";

    async execute(thoughtCtx: ThoughtContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running Reply action...");

        const ctx = await this.prepareRequest(thoughtCtx);

        await this.callLLM(ctx, llmGateway);

        thoughtCtx.finalizeIteration = true;
        console.log("End of Reply!");
    }

    private async prepareRequest(thoughtCtx: ThoughtContext): Promise<ReplyContext> {

        const promptName = 'reply';
        await thoughtCtx.sendPrepareMessage(promptName);

        const { llmOptions, messages } = thoughtCtx.data.promptSet.getMessagesFor(
            thoughtCtx.data.chat,
            thoughtCtx.data.user,
            promptName
        );

        const request: ChatIterationLLMRequest = {
            requestId: `${thoughtCtx.data.chat._id}_${v6({}, undefined, Date.now())}`,
            llmSetModel: thoughtCtx.data.llmSetConfig.models.fastChat,
            promptSetId: thoughtCtx.data.promptSet.promptSetId,
            promptName,
            messages,
            llmOptions,
            startedDate: new Date()
        };
        thoughtCtx.data.iteration.requests.push(request);
        await thoughtCtx.saveChat();

        const messageQueue = new MessageQueue<string>(thoughtCtx.sendStreamMessage.bind(thoughtCtx));

        return {
            thoughtCtx,
            request,
            parser: createBodyJsonStreamParser(messageQueue.add),
            messageQueue
        };
    }

    private async callLLM(ctx: ReplyContext, llmGateway: LlmGateway): Promise<void> {

        const response = await llmGateway.invokeAsync(
            ctx.request.llmSetModel,
            ctx.request.messages,
            ctx.parser.process,
            ctx.request.llmOptions
        );
        ctx.request.finishedDate = new Date();
        ctx.request.llmResponse = response.content;
        ctx.thoughtCtx.addUsage(ctx.request, response.usage);
        this.processResponse(ctx, response.content);
        await ctx.thoughtCtx.saveChat();
    }

    private processResponse(ctx: ReplyContext, content: string): void {
        const parseResult = ctx.parser.end(content);
        if (!parseResult) {
            throw 'Invalid llmResponse for reflection: \n' + content;
        }
        ctx.request.forUser = parseResult.body;
        try {
            const response = JSON.parse(parseResult.JSON) as ReplyResponseJSON;
            ctx.request.forContext = response;
        } catch {
            throw 'JSON parse error: ' + parseResult.JSON;
        }
    }
}

// Export instance for registry
export const replyAction = new ReplyAction();
