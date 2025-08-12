
export type MessageRole = 'user' | 'assistant'; // kept for potential future use
export type MessageModal = 'reflection' | 'reply' | 'memory_search' | 'text';
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
    Error = 6
}

export interface ChatStream {
    type: ChatStreamType;
    message?: ChatStreamMessage;
    chat?: ChatStreamChat;
    error?: string;
}

export interface ChatStreamMessage {
    modal?: MessageModal;
    content?: MessageModalType;
    // frontend helpers
    inPrepare?: boolean;
    isExpanded?: boolean;
}

export interface ChatStreamChat {
    chatId?: string;
    title?: string;
    orderIndex?: number;
}

// ================= New Iteration DTOs (Backend Response) =================
// Mirrors the API contract from /chats/:chatId/messages (ChatIterationDTO[])
export interface ChatIterationRequestDTO {
    modal: string; // backend uses 'modal' (mapped from promptName)
    content: any; // can be plain text or structured object depending on modal
}

export interface ChatIterationDTO {
    userMessage: string;
    requests: ChatIterationRequestDTO[];
}

// ================= Frontend Internal Iteration Types =================
export interface FrontendChatIterationRequest extends ChatStreamMessage { }

export interface FrontendChatIteration {
    userMessage: string;
    requests: FrontendChatIterationRequest[];
}
