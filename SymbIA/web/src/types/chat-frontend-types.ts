
export type AssistantModal = 'reflection' | 'reply' | 'memory_search';

export enum ChatStreamType {
    InitNewStream = 1,
    InitStream = 2,
    Completed = 3,
    StreamTitle = 4,
    PrepareMessage = 5,
    StreamMessage = 6,
    Error = 7
}

export interface ChatStream {
    type: ChatStreamType;
    message?: ChatStreamMessage;
    chat?: ChatStreamChat;
    error?: string;
}

export interface ChatStreamMessage {
    modal?: AssistantModal;
    content?: string;
}

export interface ChatStreamChat {
    chatId?: string;
    title?: string;
    orderIndex?: number;
}

export interface FrontendChatIterationDTO {
    userMessage: string;
    assistants: FrontendChatIterationAssistantDTO[];
}

export interface FrontendChatIterationAssistantDTO {
    modal: AssistantModal;
    content: string;
    // frontend helpers
    inPrepare?: boolean;
    isExpanded?: boolean;
}