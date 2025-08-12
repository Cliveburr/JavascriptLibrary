import type { ChatIterationLLMRequest } from '../../entities';
import type { LlmGateway } from '../../llm';
import type { ActionHandler } from '../act-defs';
import type { ThoughtContext } from '../../thought';
import type { QdrantProvider } from '../../vector';
import { ServiceRegistry, type MemoryService } from '../../services';
import { v6 } from 'uuid';
import { ParserResponse, MessageQueue, createBodyJsonStreamParser } from '../../helpers';

interface MemoryContext {
    thoughtCtx: ThoughtContext;
    request: ChatIterationLLMRequest;
    parser: ParserResponse,
    messageQueue: MessageQueue<string>;
    qdrantProvider: QdrantProvider;
    memoryService: MemoryService;
    response?: MemorySearchResponseJSON;
}

interface MemorySearchResponseJSON {
    searchGroups_REQ: Array<{
        purpose_REQ: string;
        keywords_REQ: string;
        found_SYS: boolean;
        vectorId_SYS?: string;
        content_SYS?: string;
        embeddings_SYS?: number[];
    }>;
}

export class MemorySearchAction implements ActionHandler {
    readonly name = "MemorySearch";

    async execute(thoughtCtx: ThoughtContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running MemorySearch action...");

        const ctx = await this.prepareMessage(thoughtCtx);

        await this.callLLM(ctx, llmGateway);

        await this.generateEmbeeding(ctx, llmGateway);

        await this.searchMemoryContent(ctx);

        thoughtCtx.finalizeIteration = false;
        console.log("End of MemorySearch!");
    }

    private async prepareMessage(thoughtCtx: ThoughtContext): Promise<MemoryContext> {

        const serviceRegistry = ServiceRegistry.getInstance();
        const qdrantProvider = serviceRegistry.get<QdrantProvider>('QdrantProvider');
        const memoryService = serviceRegistry.get<MemoryService>('MemoryService');

        const promptName = 'memory_search';
        await thoughtCtx.sendPrepareMessage(promptName);

        const { llmOptions, messages } = thoughtCtx.data.promptSet.getMessagesFor(
            thoughtCtx.data.chat,
            thoughtCtx.data.user,
            promptName
        );

        const request: ChatIterationLLMRequest = {
            requestId: `${thoughtCtx.data.chat._id}_${v6({}, undefined, Date.now())}`,
            llmSetModel: thoughtCtx.data.llmSetConfig.models.reasoning,
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
            messageQueue,
            qdrantProvider,
            memoryService
        };
    }

    private async callLLM(ctx: MemoryContext, llmGateway: LlmGateway): Promise<void> {

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

    private processResponse(ctx: MemoryContext, content: string): void {
        const parseResult = ctx.parser.end(content);
        if (!parseResult) {
            throw 'Invalid llmResponse for reflection: \n' + content;
        }
        ctx.request.forUser = parseResult.body;
        try {
            const response = JSON.parse(parseResult.JSON) as MemorySearchResponseJSON;
            ctx.request.forContext = response;
        } catch {
            throw 'JSON parse error: ' + parseResult.JSON;
        }
    }


    private async generateEmbeeding(ctx: MemoryContext, llmGateway: LlmGateway): Promise<void> {

        const searchGroups = ctx.response?.searchGroups_REQ;
        if (!(searchGroups && searchGroups.length > 0)) {
            return;
        }

        const texts = searchGroups
            .map(sg => sg.keywords_REQ);

        const response = await llmGateway.generateEmbedding(ctx.thoughtCtx.data.llmSetConfig, texts);
        ctx.thoughtCtx.addUsage(ctx.request, response.usage);

        if (texts.length != response.embeddings.length) {
            throw `Embedding diverging, texts: ${texts.length}, embeddings: ${response.embeddings}`;
        }

        for (let i = 0; i < texts.length; i++) {
            searchGroups[i].embeddings_SYS = response.embeddings[i];
        }
    }

    private async searchMemoryContent(ctx: MemoryContext): Promise<void> {

        const searchGroups = ctx.response?.searchGroups_REQ;
        if (!(searchGroups && searchGroups.length > 0)) {
            return;
        }

        const vectorDatabase = (await ctx.memoryService.getMemoryById(ctx.thoughtCtx.data.memoryId))
            ?.vectorDatabase;
        if (!vectorDatabase) {
            throw 'Memory not found: ' + ctx.thoughtCtx.data.memoryId;
        }

        for (const searchGroup of searchGroups) {
            if (!searchGroup.embeddings_SYS) {
                continue;
            }

            const searchResults = await ctx.qdrantProvider.search(
                vectorDatabase,
                searchGroup.embeddings_SYS,
                1
            );

            const memoryContent = searchResults[0];
            if (memoryContent) {
                searchGroup.vectorId_SYS = memoryContent.id;
                searchGroup.content_SYS = memoryContent.payload.content;
            }
        }
    }
}

// Export instance for registry
export const memorySearchAction = new MemorySearchAction();
