import { ChatEntity, ChatIteration, UserEntity } from '../entities';
import { LlmSetConfig } from '../llm';

export type MessageType = 'user' | 'reflection' | 'memory_search' | 'reply';

export interface IStreamChatContext {
    addUsage(usage: { promptTokens: number; completionTokens: number; totalTokens: number; } | undefined): void;
    user: UserEntity;
    chat: ChatEntity;
    iteration: ChatIteration;
    llmSetConfig: LlmSetConfig;
    finalizeIteration: boolean;
    sendError: (code: number, message: string, error?: unknown) => void;
    sendCompleted: () => Promise<void>;
    sendStreamTitle: (content: string) => Promise<void>;
    sendPrepareMessage(role: MessageType): Promise<void>;
    sendStreamMessage(content: string): Promise<void>;
    sendCompleteMessage(): Promise<void>;
}

// export enum ChatStreamType {
//     InitStream = 0,
//     InitNewStream = 1,
//     Completed = 2,
//     StreamTitle = 3,
//     PrepareMessage = 4,
//     StreamMessage = 5,
//     CompleteMessage = 6
// }

// export interface ChatStream {
//     type: ChatStreamType;
//     message?: ChatStreamMessage;
//     chat?: ChatStreamChat;
// }

// export interface ChatStreamMessage {
//     role?: MessageRole;
//     modal?: MessageModal;
//     content?: MessageModalType;
// }

// export interface ChatStreamChat {
//     chatId?: string;
//     title?: string;
//     orderIndex?: number;
// }
