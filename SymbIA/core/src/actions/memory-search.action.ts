import type { IChatContext } from '../types/chat-types';
import type { ActionHandler } from './act-defs';
import type { LlmGateway } from '../llm/LlmGateway';
import { parseMessageForPrompt, MessageQueue, parseXml } from '../helpers/index';
import { ServiceRegistry } from '../services/service-registry';
import type { QdrantProvider, SearchResult } from '../memory/qdrant.provider';
import type { Message, MessageMemoryModal } from '../types/domain';
import { MemoryService } from '../memory/memory.service';

interface MemoryContext {
    chatCtx: IChatContext;
    llmGateway: LlmGateway;
    message: Message;
    content: MessageMemoryModal;
    parser: (content: string) => void,
    messageQueue: MessageQueue<MessageMemoryModal>;
    qdrantProvider: QdrantProvider;
    memoryService: MemoryService;
}

export class MemorySearchAction implements ActionHandler {
    readonly name = "MemorySearch";
    readonly whenToUse = `Use this action when you need to search for some type of information to take another action, it could be something the user is asking, something they need before using a tool, or something they have no idea what it is.`;
    readonly enabled = true;

    async execute(chatCtx: IChatContext, llmGateway: LlmGateway): Promise<void> {
        console.log("Running MemorySearch action...");

        const ctx = await this.prepareMessage(chatCtx, llmGateway);

        await this.generateSearchKeywords(ctx, llmGateway);

        await this.generateEmbeeding(ctx);

        await this.searchMemoryContent(ctx);

        await chatCtx.sendCompleteMessage(ctx.message);

        ctx.chatCtx.finalizeIteration = false;
        console.log("End of MemorySearch!");
    }

    private async prepareMessage(chatCtx: IChatContext, llmGateway: LlmGateway): Promise<MemoryContext> {

        const serviceRegistry = ServiceRegistry.getInstance();

        const qdrantProvider = serviceRegistry.get<QdrantProvider>('QdrantProvider');
        const memoryService = serviceRegistry.get<MemoryService>('MemoryService');

        const message = await chatCtx.sendPrepareMessage('assistant', 'memory');
        const content: MessageMemoryModal = {
            title: '',
            status: 'prepare',
            content: '',
            memories: []
        };
        message.content = content;

        const messageQueue = new MessageQueue<MessageMemoryModal>(chatCtx.sendStreamMessage.bind(chatCtx));

        const onTagOpenKeywords = (): void => {
            content.memories.push({
                vectorId: '',
                keyWords: ''
            });
        };

        const onTitle = (partialContent: string) => {
            content.title += partialContent;
            messageQueue.add({
                title: partialContent,
                content: '',
                memories: []
            });
        };

        const onExplanation = (partialContent: string) => {
            content.content += partialContent;
            messageQueue.add({
                title: '',
                content: partialContent,
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
            memoryService
        };
    }

    private async generateSearchKeywords(ctx: MemoryContext, llmGateway: LlmGateway): Promise<void> {
        // Prepare messages for reasoning
        const messages = ctx.chatCtx.messages.map(parseMessageForPrompt);
        const reasoningMessages = [
            { role: 'system' as const, content: this.getReasoningPrompt() },
            ...messages
        ];

        // Send preparation message and get LLM response
        const response = await llmGateway.invokeAsync(
            ctx.chatCtx.llmSetConfig.models.reasoning,
            reasoningMessages,
            ctx.parser,
            {
                temperature: 0.3,
                maxTokens: 500
            });

        if (response.usage) {
            ctx.message.promptTokens = response.usage.promptTokens;
            ctx.message.completionTokens = response.usage.completionTokens;
        }
    }

    private async generateEmbeeding(ctx: MemoryContext): Promise<void> {

        const memory = ctx.memoryService.getMemoryById(ctx.chatCtx.memoryId);
        if (!memory) {
            throw 'Memory not found: ' + ctx.chatCtx.memoryId;
        }

        const texts = ctx.content.memories
            .map(m => m.keyWords);

        ctx.messageQueue.add({
            title: '',
            status: 'embedding',
            content: '',
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

        ctx.messageQueue.add({
            title: '',
            status: 'searching',
            content: '',
            memories: []
        });

        for (const memory of ctx.content.memories) {
            if (!memory.embedding) {
                continue;
            }

            const searchResults = await ctx.qdrantProvider.search(
                ctx.chatCtx.memoryId,
                memory.embedding,
                1,
                { type: 'text' }
            );

            const memoryContent = searchResults[0];
            if (memoryContent) {
                memory.vectorId = memoryContent.id;
                if (memoryContent.payload) {
                    memory.content = memoryContent.payload;
                }
            }
        }
    }

    private getReasoningPrompt(): string {
        return `You are an AI assistant that must generate a list of small, isolated contexts of the information you want to search for.

CRUCIAL RULES:

1. You MUST output exactly three XML-like tags in this exact order:
   <title>...</title>
   <explanation>...</explanation>
   <keywords>...</keywords>

2. Do NOT output anything outside these three tags.

3. Title: Short, ≤ 10 words, summarizes your explanation.

4. Explanation: Concise text explaining the purpose of the memories, ≤ 150 words, why you need this information.

5. Keywords: Can have multiple <keywords> tags, each tag refers to a particular memory to search
`;
    }
}

// Export instance for registry
export const memorySearchAction = new MemorySearchAction();
