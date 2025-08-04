
export type FrontendMessageRole = 'user' | 'assistant' | 'system';
export type FrontendMessageModal = 'text' | 'form' | 'chart' | 'file' | 'memory';

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

export interface FrontendMessage {
    id: string;
    role: FrontendMessageRole;
    modal: FrontendMessageModal;
    content: string;
}

export interface ChatInitNewStreamMessage {
    type: MessageType.InitNewStream;
    userMessage: FrontendMessage;
    chatId: string;
    orderIndex: number;
}

export interface ChatInitStreamMessage {
    type: MessageType.InitStream;
    userMessage: FrontendMessage;
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
    role: FrontendMessageRole;
    modal: FrontendMessageModal;
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
