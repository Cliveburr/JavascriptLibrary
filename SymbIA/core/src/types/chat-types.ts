import type { Message, MessageModal, MessageModalType, MessageRole } from './domain';
import type { LlmSetConfig } from './llm';

export interface IChatContext {
    memoryId: string;
    chatId: string;
    userMessage: string;
    messages: Message[];
    llmSetConfig: LlmSetConfig;
    finalizeIteration: boolean;
    sendError: (code: number, message: string, error?: unknown) => void;
    sendCompleted: () => Promise<void>;
    sendStreamTitle: (content: string) => Promise<void>;
    sendPrepareMessage(role: MessageRole, modal: MessageModal): Promise<Message>;
    sendStreamMessage(content: MessageModalType): Promise<void>;
    sendCompleteMessage(message: Message): Promise<void>;
}

export enum ChatStreamType {
    InitStream = 0,
    InitNewStream = 1,
    Completed = 2,
    StreamTitle = 3,
    PrepareMessage = 4,
    StreamMessage = 5,
    CompleteMessage = 6
}

export interface ChatStream {
    type: ChatStreamType;
    message?: ChatStreamMessage;
    chat?: ChatStreamChat;
}

export interface ChatStreamMessage {
    messageId?: string;
    role?: MessageRole;
    modal?: MessageModal;
    content?: MessageModalType;
}

export interface ChatStreamChat {
    chatId?: string;
    title?: string;
    orderIndex?: number;
}
