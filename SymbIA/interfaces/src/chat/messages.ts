
export enum MessageType {
    User,
    Completed,
    StartTitle,
    ChunkTitle,
    Thiking,
    StartText,
    ChunkText,
    EndText
}

export interface ChatUserMessage {
    type: MessageType.User;
    content: string;
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

export interface ChatThikingMessage {
    type: MessageType.Thiking;
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
