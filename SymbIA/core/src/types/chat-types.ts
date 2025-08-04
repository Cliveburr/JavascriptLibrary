import type { Message, MessageModal, MessageRole } from './domain';
import type { LlmSetConfig } from './llm';

export interface IChatContext {
    content: string;
    messages: Message[];
    llmSetConfig: LlmSetConfig;
    finalizeIteration: boolean;
    sendThinking: () => Promise<void>;
    sendError: (code: number, message: string, error?: unknown) => void;
    sendStreamTitleMessage: (content: string) => Promise<void>;
    sendPrepareStreamTextMessage: (role: MessageRole, modal: MessageModal) => Promise<Message>;
    sendStreamTextMessage: (content: string) => Promise<void>;
    sendCompleteStreamTextMessage: (message: Message, fullContent: string) => Promise<void>;
}

export enum MessageType {
    InitStream = 0,
    InitNewStream = 1,
    Completed = 2,
    StreamTitle = 3,
    Thinking = 4,
    PrepareStreamText = 5,
    StreamText = 6,
    CompleteStreamText = 7
}

export interface FrontMessage {
    id: string;
    role: MessageRole;
    modal: MessageModal;
    content: string;
}

export interface ChatInitNewStreamMessage {
    type: MessageType.InitNewStream;
    userMessage: FrontMessage;
    chatId: string;
    orderIndex: number;
}

export interface ChatInitStreamMessage {
    type: MessageType.InitStream;
    userMessage: FrontMessage;
}

export interface ChatCompletedMessage {
    type: MessageType.Completed;
}

export interface ChatStreamTitleMessage {
    type: MessageType.StreamTitle;
    content: string;
}

export interface ChatThinkingMessage {
    type: MessageType.Thinking;
}

export interface ChatPrepareStreamTextMessage {
    type: MessageType.PrepareStreamText;
    role: MessageRole;
    modal: MessageModal;
}

export interface ChatStreamTextMessage {
    type: MessageType.StreamText;
    content: string;
}

export interface ChatCompleteStreamTextMessage {
    type: MessageType.CompleteStreamText;
    id: string;
}

export type MessageFormat = ChatInitStreamMessage | ChatInitNewStreamMessage | ChatCompletedMessage | ChatStreamTitleMessage
    | ChatThinkingMessage | ChatPrepareStreamTextMessage | ChatStreamTextMessage | ChatCompleteStreamTextMessage;
