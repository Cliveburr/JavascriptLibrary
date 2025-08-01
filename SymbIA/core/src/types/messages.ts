
export enum MessageType {
    User,
    Completed,
    StartTitle,
    ChunkTitle,
    Thinking,
    StartText,
    ChunkText,
    EndText
}

export interface ChatUserMessage {
    type: MessageType.User;
    content: string;
    chatId?: string; // Incluir chatId para casos de novo chat
}

export interface ChatCompletedMessage {
    type: MessageType.Completed;
}

export interface ChatStartTitleMessage {
    type: MessageType.StartTitle;
    content: string;
}

export interface ChatChunkTitleMessage {
    type: MessageType.ChunkTitle;
    content: string;
}

export interface ChatThinkingMessage {
    type: MessageType.Thinking;
}

export interface ChatStartTextMessage {
    type: MessageType.StartText;
    content: string;
}

export interface ChatChunkTextMessage {
    type: MessageType.ChunkText;
    content: string;
}

export interface ChatEndTextMessage {
    type: MessageType.EndText;
}

export type MessageFormat = ChatUserMessage | ChatCompletedMessage | ChatStartTitleMessage | ChatChunkTitleMessage
    | ChatThinkingMessage | ChatStartTextMessage | ChatChunkTextMessage | ChatEndTextMessage;
