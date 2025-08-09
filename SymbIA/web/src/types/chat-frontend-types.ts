
export type MessageRole = 'user' | 'assistant';
export type MessageModal = 'text' | 'reflection' | 'memory';
export type MessageModalType = string | MessageReflectionModal | MessageMemoryModal;

export interface MessageReflectionModal {
    content: string;
}

export type MessageMemoryContentType = string;
export type MessageMemoryStatus = 'prepare' | 'embedding' | 'searching';
export type VectorContentTypes = string;
export enum VectorContentType {
    PlainText
}

export interface MessageMemoryModal {
    title: string;
    explanation?: string;
    status?: MessageMemoryStatus;
    memories: Array<{
        keyWords: string;
        vectorId?: string;
        content?: {
            type: VectorContentType,
            value: VectorContentTypes;
        },
        embedding?: number[];
    }>;
    error?: string;
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

    // Only used in frontend
    inPrepare?: boolean;
    originModal?: MessageModal;
    isExpanded?: boolean;
}

export interface ChatStreamChat {
    chatId?: string;
    title?: string;
    orderIndex?: number;
}
