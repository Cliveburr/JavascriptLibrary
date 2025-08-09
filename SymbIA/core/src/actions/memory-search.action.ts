import type { IChatContext } from '../types/chat-types';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';
import { parseMessageForPrompt, MessageQueue, parseXml } from '../helpers/index';
import { ServiceRegistry } from '../services/service-registry';
import type { QdrantProvider, SearchResult } from '../memory/qdrant.provider';
import type { Message, MessageMemoryModal } from '../types/domain';
import { MemoryService } from '../memory/memory.service';
import { DebugService } from '../debug/debug.service';

interface MemoryContext {
    chatCtx: IChatContext;
    llmGateway: LlmGateway;
    message: Message;
    content: MessageMemoryModal;
    parser: (content: string) => void,
    messageQueue: MessageQueue<MessageMemoryModal>;
    qdrantProvider: QdrantProvider;
    memoryService: MemoryService;
    debugService?: DebugService;
}

export class MemorySearchAction implements ActionHandler {
    readonly name = "MemorySearch";
    readonly whenToUse = `Use this action in ALL OTHER CASES, including:
    ** Whenever there is any possibility that the answer or relevant context might exist in memory
    ** Before asking the user anything
    ** Before stating that you do not know something
    ** Before selecting MemorySearch, check any previous Memories in assistnt messages that explanation is the same or semantically equivalent to what you would search now. Normalize text (lowercase, trim, remove punctuation) and consider explanations equivalent if meaning similarity ≥ 0.85. If such a match exists, DO NOT select MemorySearch;`;

    readonly enabled = true;

    async execute(chatCtx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running MemorySearch action...");

        const ctx = await this.prepareMessage(chatCtx, llmGateway);

        await this.generateSearchKeywords(ctx, llmGateway);

        await this.generateEmbeeding(ctx);

        await this.searchMemoryContent(ctx);

        delete ctx.content.status;
        await chatCtx.sendCompleteMessage(ctx.message);

        ctx.chatCtx.finalizeIteration = false;
        console.log("End of MemorySearch!");
    }

    private async prepareMessage(chatCtx: IChatContext, llmGateway: LlmGateway): Promise<MemoryContext> {

        const serviceRegistry = ServiceRegistry.getInstance();
        const qdrantProvider = serviceRegistry.get<QdrantProvider>('QdrantProvider');
        const memoryService = serviceRegistry.get<MemoryService>('MemoryService');
        const debugService = serviceRegistry.getOptional<DebugService>('DebugService');

        const message = await chatCtx.sendPrepareMessage('assistant', 'memory');
        const content: MessageMemoryModal = {
            title: '',
            explanation: '',
            status: 'prepare',
            memories: []
        };
        message.content = content;

        const messageQueue = new MessageQueue<MessageMemoryModal>(chatCtx.sendStreamMessage.bind(chatCtx));

        const onTagOpenKeywords = (): void => {
            content.memories.push({
                keyWords: ''
            });
        };

        const onTitle = (partialContent: string) => {
            content.title += partialContent;
            messageQueue.add({
                title: partialContent,
                explanation: '',
                memories: []
            });
        };

        const onExplanation = (partialContent: string) => {
            content.explanation += partialContent;
            messageQueue.add({
                title: '',
                explanation: partialContent,
                memories: []
            });
        };

        const onKeywords = (partialContent: string) => {
            content.title += partialContent;
            const lastMemory = content.memories[content.memories.length - 1];
            if (lastMemory) {
                lastMemory.keyWords += partialContent;
            }
            else {
                console.error("Invalid Xml parse, keyword content without open!");
            }
        };

        return {
            chatCtx,
            llmGateway,
            message,
            content,
            parser: parseXml([
                { tag: 'title', callback: onTitle },
                { tag: 'explanation', callback: onExplanation },
                { tag: 'keywords', callback: onKeywords }
            ], [
                { tag: 'keywords', callback: onTagOpenKeywords }
            ]),
            messageQueue,
            qdrantProvider,
            memoryService,
            debugService
        };
    }

    private async generateSearchKeywords(ctx: MemoryContext, llmGateway: LlmGateway): Promise<void> {
        // Prepare messages for reasoning
        const messages = ctx.chatCtx.messages.map(parseMessageForPrompt);
        const reasoningMessages = [
            { role: 'system', content: this.getReasoningPrompt() },
            ...messages,
            { role: 'user', content: 'Generate the search contexts now.' }
        ];

        // Send preparation message and get LLM response
        const response = await llmGateway.invokeAsync(
            ctx.chatCtx.llmSetConfig.models.reasoning,
            reasoningMessages,
            ctx.parser,
            {
                temperature: 0.3
            });
        ctx.debugService?.addRequest(ctx.chatCtx.chatId, reasoningMessages, response.content);

        if (response.usage) {
            ctx.message.promptTokens = response.usage.promptTokens;
            ctx.message.completionTokens = response.usage.completionTokens;
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
