import type { Request, Response } from 'express';
import type { ChatService, LlmRequestMessage } from '@symbia/core';

// Interfaces for requests/responses
export interface DebugListQuery {
    chatId: string;
}

export type DebugListResponse = string[]; // list of ISO timestamps

export interface DebugGetParams {
    chatId: string;
}

export interface DebugGetQuery {
    timestamp: string; // ISO string
}

export interface DebugGetResponse {
    messages: LlmRequestMessage[];
    response?: string;
}

export class DebugController {
    constructor(private chatService: ChatService) { }

    async list(req: Request, res: Response) {
        const chatId = req.query.chatId;
        if (!chatId || typeof chatId !== 'string') return res.status(400).json([]);
        const chat = await this.chatService.getChatById(chatId);
        if (!chat) return res.status(404).json([]);
        const response: DebugListResponse[] = chat.iterations
            .map(i => i.requests
                .map(r => r.startedDate.toLocaleString()));
        res.json(response);
    }

    async get(req: Request, res: Response) {
        const chatId = req.params.chatId as string;
        const timestamp = req.query.timestamp as string;
        if (!chatId || !timestamp) return res.status(400).json({ error: 'chatId and timestamp are required' });
        const chat = await this.chatService.getChatById(chatId);
        if (!chat) return res.status(404).json({ error: 'Chat Not found' });
        const request = chat.iterations
            .flatMap(i => i.requests)
            .find(r => r.startedDate.toLocaleString() == timestamp);
        if (!request) return res.status(404).json({ error: 'Request Not found' });
        const response: DebugGetResponse = {
            messages: request.messages,
            response: request.llmResponse
        };
        res.json(response);
    }
}
