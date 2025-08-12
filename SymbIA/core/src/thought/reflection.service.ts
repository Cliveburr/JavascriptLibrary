import type { ChatIterationLLMRequest } from '../entities';
import type { LlmGateway } from '../llm';
import type { ThoughtContext } from './thought-context';
import { v6 } from 'uuid';
import { ParserResponse, MessageQueue, createBodyJsonStreamParser } from '../helpers';
import { ServerMonitoringMode } from 'mongodb';

const BODYJSONSENTINEL = '<<END-OF-BODY>>';

interface ReflectionContext {
    thoughtCtx: ThoughtContext;
    request: ChatIterationLLMRequest;
    //parser: ParserResponse,
    messageQueue: MessageQueue<string>;
    action?: string;
}

interface ReflectionResponseJSON {
    action_REQ: string;
}

export class ReflectionService {
    constructor(
        private llmGateway: LlmGateway
    ) { }

    async reflectOnNextAction(thoughtCtx: ThoughtContext): Promise<string | undefined> {
        console.log('Reflecting...');

        const ctx = await this.prepareRequest(thoughtCtx);

        await this.callLLM(ctx);

        console.log('End of Reflection!');
        return ctx.action;
    }

    private async prepareRequest(thoughtCtx: ThoughtContext): Promise<ReflectionContext> {

        const promptName = 'reflection';
        await thoughtCtx.sendPrepareMessage(promptName);

        const { llmOptions, messages } = thoughtCtx.data.promptSet.getMessagesFor(
            thoughtCtx.data.chat,
            thoughtCtx.data.user,
            promptName
        );

        const request: ChatIterationLLMRequest = {
            requestId: `${thoughtCtx.data.chat._id}_${v6({}, undefined, Date.now())}`,
            llmSetModel: thoughtCtx.data.llmSetConfig.models.reasoningHeavy,
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
            //parser: createBodyJsonStreamParser(messageQueue.add),
            messageQueue
        };
    }

    private async callLLM(ctx: ReflectionContext): Promise<void> {

        const response = await this.llmGateway.invokeBodyJSONAsync(
            ctx.request.llmSetModel,
            BODYJSONSENTINEL,
            ctx.request.messages,
            ctx.messageQueue.add.bind(ctx.messageQueue),
            ctx.request.llmOptions
        );
        ctx.request.finishedDate = new Date();
        ctx.request.llmResponse = response.content;
        ctx.thoughtCtx.addUsage(ctx.request, response.usage);
        this.processResponse(ctx, response.content);
        await ctx.thoughtCtx.saveChat();
    }

    private processResponse(ctx: ReflectionContext, content: string): void {
        try {
            //const parseResult = ctx.parser.end(content);
            const bodyJSON = content.split(BODYJSONSENTINEL);
            if (bodyJSON.length != 2) {
                throw 'Invalid llmResponse for reflection: \n' + content;
            }
            ctx.request.forUser = bodyJSON[0];
            try {
                const response = JSON.parse(bodyJSON[1]) as ReflectionResponseJSON;
                ctx.request.forContext = response;
                ctx.action = response.action_REQ;
            } catch {
                throw 'JSON parse error: ' + bodyJSON[1];
            }
        } catch (err) {
            console.error(err);
        }
    }
}
