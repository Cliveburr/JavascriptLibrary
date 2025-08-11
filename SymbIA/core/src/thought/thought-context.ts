import type { ChatEntity, ChatIteration, ChatIterationLLMRequest, UserEntity } from '../entities';
import type { LlmResponseUsage, LlmSetConfig } from '../llm';
import type { ChatService, PromptSetForUse } from '../services';

export interface ThoughtContextData {
    memoryId: string;
    userMessage: string;
    user: UserEntity;
    isNewChat: boolean;
    chat: ChatEntity;
    iteration: ChatIteration;
    llmSetConfig: LlmSetConfig;
    promptSet: PromptSetForUse;
}

export interface ThoughtContextError {
    isError: boolean;
    code: number;
    message: string;
    error?: any;
}

export interface ThoughtContextTransport {
    status(code: number, data: any): void;
    end(): void;
    write(data: string): Promise<void>;
}

export enum ChatStreamType {
    InitStream = 0,
    InitNewStream = 1,
    Completed = 2,
    StreamTitle = 3,
    PrepareMessage = 4,
    StreamMessage = 5
}

export interface ChatStream {
    type: ChatStreamType;
    message?: ChatStreamMessage;
    chat?: ChatStreamChat;
}

export type ChatStreamModal = 'reflection' | 'reply' | 'memory_search';

export interface ChatStreamMessage {
    modal?: ChatStreamModal;
    content?: string;
}

export interface ChatStreamChat {
    chatId?: string;
    title?: string;
    orderIndex?: number;
}

export class ThoughtContext {

    // get memoryId() { return this.data.memoryId; }
    // get chat() { return this.data.chat; }
    // get chat() { return this.data.chat; }
    // get iteration() { return this.data.iteration; }
    // get llmSetConfig() { return this.data.llmSetConfig; }
    // get promptSet() { return this.data.promptSet; }
    finalizeIteration: boolean = false;

    constructor(
        private chatService: ChatService,
        public data: ThoughtContextData,
        private transport: ThoughtContextTransport
    ) {
    }

    sendError(code: number, message: string, error?: any): void {
        // If not error, means that is user error and not system
        if (error) {
            console.error(message, error); //TODO: maybe log in db, future error handler service
        }
        try {
            this.transport.status(code, message);
        } catch { }

        // Flush chat to db
        this.saveChat()
            .then();
    }

    async sendCompleted(): Promise<void> {
        await this.sendStream({
            type: ChatStreamType.Completed
        });
        this.transport.end();
    }

    sendStreamTitle(content: string): Promise<void> {
        return this.sendStream({
            type: ChatStreamType.StreamTitle,
            chat: {
                title: content
            }
        });
    }

    sendPrepareMessage(modal?: ChatStreamModal): Promise<void> {
        return this.sendStream({
            type: ChatStreamType.PrepareMessage,
            message: {
                modal
            }
        });
    }

    sendStreamMessage(content: string): Promise<void> {
        return this.sendStream({
            type: ChatStreamType.StreamMessage,
            message: {
                content
            }
        });
    }

    async saveChat(): Promise<void> {
        if (!await this.chatService.replaceChat(this.data.chat)) {
            throw 'Error updating chat! ' + this.data.chat._id.toString();
        };
    }

    addUsage(request: ChatIterationLLMRequest, usage?: LlmResponseUsage): void {
        if (usage) {
            request.promptTokens = usage.promptTokens;
            request.completionTokens = usage.completionTokens;
            request.totalTokens = usage.totalTokens;
            this.data.iteration.promptTokens = (this.data.iteration.promptTokens || 0) + usage.promptTokens;
            this.data.iteration.completionTokens = (this.data.iteration.completionTokens || 0) + usage.completionTokens;
            this.data.iteration.totalTokens = (this.data.iteration.totalTokens || 0) + usage.totalTokens;
            this.data.chat.promptTokens = (this.data.chat.promptTokens || 0) + usage.promptTokens;
            this.data.chat.completionTokens = (this.data.chat.completionTokens || 0) + usage.completionTokens;
            this.data.chat.totalTokens = (this.data.chat.totalTokens || 0) + usage.totalTokens;
        }
    }

    private sendStream(message: ChatStream): Promise<void> {
        return this.transport.write(JSON.stringify(message) + '\n');
        // return new Promise((resolve, reject) => {
        //     this.res.write(JSON.stringify(message) + '\n', 'utf8', (error) => {
        //         if (error) {
        //             reject(error);
        //         } else {
        //             resolve();
        //         }
        //     });
        // });
    }
}
