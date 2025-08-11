import { v6 } from 'uuid';
import { ChatContext, ChatContextMemorySearchResponse, ChatIterationLLMRequest } from '../../entities';
import { BodyJsonParser, createBodyJsonStreamParser, filterContextForRequest, MessageQueue, parseXml } from '../../helpers';
import { LlmGateway } from '../../llm';
import { MemoryService, ServiceRegistry } from '../../services';
import { IStreamChatContext } from '../../thought/stream-chat';
import { QdrantProvider } from '../../vector';
import { ActionHandler } from '../act-defs';
import { memorySearchPromptV0 } from './memory-search-prompt-v0';

interface MemoryContext {
    chatCtx: IStreamChatContext;
    request: ChatIterationLLMRequest;
    parser: BodyJsonParser,
    messageQueue: MessageQueue<string>;
    qdrantProvider: QdrantProvider;
    memoryService: MemoryService;
}

export class MemorySearchAction implements ActionHandler {
    readonly name = "MemorySearch";

    async execute(chatCtx: IStreamChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running MemorySearch action...");

        const ctx = await this.prepareMessage(chatCtx);

        await this.callLLM(ctx, llmGateway);

        await this.generateEmbeeding(ctx);

        await this.searchMemoryContent(ctx);

        delete ctx.content.status;
        await chatCtx.sendCompleteMessage(ctx.message);

        ctx.chatCtx.finalizeIteration = false;
        console.log("End of MemorySearch!");
    }

    private async prepareMessage(chatCtx: IStreamChatContext): Promise<MemoryContext> {

        const serviceRegistry = ServiceRegistry.getInstance();
        const qdrantProvider = serviceRegistry.get<QdrantProvider>('QdrantProvider');
        const memoryService = serviceRegistry.get<MemoryService>('MemoryService');

        await chatCtx.sendPrepareMessage('memory_search');

        const systemPrompt = memorySearchPromptV0
            .replace('{{userLanguage}}', chatCtx.user.reponseLanguage);

        const request: ChatIterationLLMRequest = {
            requestId: `${chatCtx.chat._id}_${v6({}, undefined, Date.now())}`,
            promptType: 'memory_search',
            llmSetModel: {
                provider: chatCtx.llmSetConfig.models.reasoning.provider,
                model: chatCtx.llmSetConfig.models.reasoning.model,
                temperature: 0.3
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
            messageQueue,
            qdrantProvider,
            memoryService
        };
    }

    private async callLLM(ctx: MemoryContext, llmGateway: LlmGateway): Promise<void> {

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
        ctx.chatCtx.addUsage(response.usage);
        this.processResponse(ctx, response.content);
    }

    private processResponse(ctx: MemoryContext, content: string): void {
        const parseResult = ctx.parser.end(content);
        if (!parseResult) {
            throw 'Invalid llmResponse for reflection: \n' + content;
        }

        try {
            const response = JSON.parse(parseResult.JSON) as ChatContextMemorySearchResponse;
            const context: ChatContext = {
                type: 'memory_search_response',
                memorySearchResponse: response
            };
            ctx.request.contexts.push(context);
        } catch {
            throw 'JSON parse error: ' + parseResult.JSON;
        }
    }


    private async generateEmbeeding(ctx: MemoryContext): Promise<void> {

        const texts = ctx.content.memories
            .map(m => m.keyWords);

        ctx.messageQueue.add({
            title: '',
            explanation: '',
            status: 'embedding',
            memories: []
        });

        const response = await ctx.llmGateway.generateEmbedding(ctx.chatCtx.llmSetConfig, texts);

        if (response.usage) {
            ctx.message.embeedingPromptTokens = response.usage.promptTokens;
        }

        if (texts.length != response.embeddings.length) {
            throw `Embedding diverging, texts: ${texts.length}, embeddings: ${response.embeddings}`;
        }

        for (let i = 0; i < texts.length; i++) {
            ctx.content.memories[i].embedding = response.embeddings[i];
        }
    }

    private async searchMemoryContent(ctx: MemoryContext): Promise<void> {

        const vectorDatabase = (await ctx.memoryService.getMemoryById(ctx.chatCtx.memoryId))
            ?.vectorDatabase;
        if (!vectorDatabase) {
            throw 'Memory not found: ' + ctx.chatCtx.memoryId;
        }

        ctx.messageQueue.add({
            title: '',
            explanation: '',
            status: 'searching',
            memories: []
        });

        for (const memory of ctx.content.memories) {
            if (!memory.embedding) {
                continue;
            }

            const searchResults = await ctx.qdrantProvider.search(
                vectorDatabase,
                memory.embedding,
                1
            );

            const memoryContent = searchResults[0];
            if (memoryContent) {
                memory.vectorId = memoryContent.id;
                memory.content = memoryContent.payload.content;
            }
        }
    }

    private getReasoningPrompt(): string {
        return `You are an AI assistant that must generate a list of small, isolated contexts of the information you want to search for.

CRUCIAL RULES:

1. Title: Short, ≤ 10 words, summarizes your explanation.
2. Explanation: Concise text explaining the purpose of the memories, ≤ 150 words, why you need this information.
4. Keywords: Each keywords tag can contains more than one word and refers to a particular memory to search.
5. You MUST output exactly XML-like tags below:
   <title>...</title>
   <explanation>...</explanation>
   <contexts>
     <keywords>...</keywords>
   </contexts>`;

    }
}

// Export instance for registry
export const memorySearchAction = new MemorySearchAction();
