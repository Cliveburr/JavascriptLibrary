
export enum MessageType {
    InitStream = 0,
    InitNewStream = 1,
    Completed = 2,
    StreamTitle = 3,
    Thinking = 4,
    StreamText = 5
}

export interface ChatInitStreamMessage {
    type: MessageType.InitStream;
    content: string;
}

export interface ChatInitNewStreamMessage {
    type: MessageType.InitNewStream;
    content: string;
    chatId: string;
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

export interface ChatStreamTextMessage {
    type: MessageType.StreamText;
    content: string;
}

export type MessageFormat = ChatInitStreamMessage | ChatInitNewStreamMessage | ChatCompletedMessage | ChatStreamTitleMessage
    | ChatThinkingMessage | ChatStreamTextMessage;
