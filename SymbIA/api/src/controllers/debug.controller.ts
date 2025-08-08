import type { Request, Response } from 'express';
import type { DebugService, LlmRequestMessage } from '@symbia/core';

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
    constructor(private debugService: DebugService) { }

    list(req: Request, res: Response) {
        const chatId = req.query.chatId;
        if (!chatId || typeof chatId !== 'string') return res.status(400).json([]);
        const data = this.debugService.getByChat(chatId);
        if (!data) return res.status(404).json([]);
        const timestamps = data.requests.map(r => r.timestamp);
        res.json(timestamps);
    }

    get(req: Request, res: Response) {
        const chatId = req.params.chatId as string;
        const timestamp = req.query.timestamp as string;
        if (!chatId || !timestamp) return res.status(400).json({ error: 'chatId and timestamp are required' });
        const data = this.debugService.getByChatAt(chatId, timestamp);
        if (!data || data.requests.length === 0) return res.status(404).json({ error: 'Not found' });
        const first = data.requests[0];
        res.json({ messages: first.messages, response: first.response });
    }

    clear(_req: Request, res: Response) {
        this.debugService.clear();
        res.status(204).send();
    }
}
