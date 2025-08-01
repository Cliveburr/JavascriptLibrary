import type { Message } from '../domain';
import type { LlmSetConfig } from '../llm';

export interface IChatContext {
    content: string;
    messages: Message[];
    llmSetConfig: LlmSetConfig;
    sendThinking: () => void;
    sendError: (code: number, message: string, error?: any) => void;
    sendStartTextMessage: (content: string) => void;
    sendChunkTextMessage: (content: string) => void;
    sendEndTextMessage: (fullContent: string) => Promise<void>;
}