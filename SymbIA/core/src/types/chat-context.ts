import type { Message, MessageModal, MessageRole } from './domain';
import type { LlmSetConfig } from './llm';

export interface IChatContext {
    content: string;
    messages: Message[];
    llmSetConfig: LlmSetConfig;
    sendThinking: () => void;
    sendError: (code: number, message: string, error?: unknown) => void;
    sendStreamTextMessage: (content: string) => void;
    saveMessage(role: MessageRole, content: string, modal: MessageModal): Promise<void>;
}
