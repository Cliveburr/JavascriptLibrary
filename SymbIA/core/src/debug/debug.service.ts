import type { LlmRequestMessage } from '../types/llm.js';

export interface LlmChatDebug {
    chatId: string;
    requests: Array<{
        timestamp: string;
        messages: LlmRequestMessage[];
        response?: string;
    }>;
}

export class DebugService {
    private chats: Map<string, LlmChatDebug> = new Map();
    private maxRequestsPerChat: number;

    constructor(maxRequestsPerChat = 200) {
        this.maxRequestsPerChat = Math.max(10, maxRequestsPerChat);
    }

    // Backward-compat: no-op to avoid breaking older call sites
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    record(_record: any): void { /* intentionally ignored */ }

    addRequest(chatId: string, messages: LlmRequestMessage[], response?: string): void {
        if (!chatId) return;
        const entry = this.chats.get(chatId) || { chatId, requests: [] };
        entry.requests.push({ timestamp: new Date().toISOString(), messages, response });
        if (entry.requests.length > this.maxRequestsPerChat) {
            entry.requests.splice(0, entry.requests.length - this.maxRequestsPerChat);
        }
        this.chats.set(chatId, entry);
    }

    getByChat(chatId: string): LlmChatDebug | undefined {
        return this.chats.get(chatId);
    }

    getByChatSince(chatId: string, sinceIso: string): LlmChatDebug | undefined {
        const base = this.chats.get(chatId);
        if (!base) return undefined;
        const since = Date.parse(sinceIso);
        if (isNaN(since)) return base;
        return {
            chatId,
            requests: base.requests.filter(r => Date.parse(r.timestamp) >= since)
        };
    }

    getByChatAt(chatId: string, timestampIso: string): LlmChatDebug | undefined {
        const base = this.chats.get(chatId);
        if (!base) return undefined;
        return {
            chatId,
            requests: base.requests.filter(r => r.timestamp === timestampIso)
        };
    }

    clear(): void {
        this.chats.clear();
    }
}
