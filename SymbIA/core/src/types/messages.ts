
export enum MessageType {
    User = 0,
    Completed = 1,
    StreamTitle = 2,
    Thinking = 3,
    StreamText = 4
}

export interface ChatUserMessage {
    type: MessageType.User;
    content: string;
    chatId?: string; // Incluir chatId para casos de novo chat
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

export type MessageFormat = ChatUserMessage | ChatCompletedMessage | ChatStreamTitleMessage
    | ChatThinkingMessage | ChatStreamTextMessage;
