import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { PromptService } from '@symbia/core';

export class PromptsController {
    constructor(private promptService: PromptService) { }

    async listSummaries(_req: Request, res: Response) {
        try {
            const summaries = await this.promptService.getPromptSetSummaries();
            res.json(summaries);
        } catch (err: any) {
            res.status(500).json({ error: err?.message || 'Failed to list prompt sets' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = new ObjectId(req.params.id);
            const item = await this.promptService.getPromptSet(id);
            if (!item) return res.status(404).json({ error: 'Not found' });
            res.json(item);
        } catch {
            res.status(400).json({ error: 'Invalid id' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const data = req.body;
            const created = await this.promptService.createPromptSet({
                alias: data.alias,
                observation: data.observation,
                manualVersion: Number(data.manualVersion) || 1,
                tuningVersion: Number(data.tuningVersion) || 0,
                isForTunning: !!data.isForTunning,
                prompts: Array.isArray(data.prompts) ? data.prompts : [],
                fromTunningId: data.fromTunningId ? new ObjectId(data.fromTunningId) : undefined,
            });
            res.status(201).json(created);
        } catch (err: any) {
            res.status(500).json({ error: err?.message || 'Failed to create' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = new ObjectId(req.params.id);
            const data = req.body;
            const updated = await this.promptService.updatePromptSet(id, {
                alias: data.alias,
                observation: data.observation,
                manualVersion: data.manualVersion,
                tuningVersion: data.tuningVersion,
                isForTunning: data.isForTunning,
                prompts: data.prompts,
                fromTunningId: data.fromTunningId ? new ObjectId(data.fromTunningId) : undefined,
            });
            if (!updated) return res.status(404).json({ error: 'Not found' });
            res.json(updated);
        } catch (err: any) {
            res.status(400).json({ error: err?.message || 'Failed to update' });
        }
    }

    async remove(req: Request, res: Response) {
        try {
            const id = new ObjectId(req.params.id);
            const ok = await this.promptService.deletePromptSet(id);
            if (!ok) return res.status(404).json({ error: 'Not found' });
            res.status(204).send();
        } catch {
            res.status(400).json({ error: 'Invalid id' });
        }
    }

    async setCurrent(req: Request, res: Response) {
        try {
            const id = new ObjectId(req.params.id);
            await this.promptService.setActualPromptSet(id);
            res.status(204).send();
        } catch {
            res.status(400).json({ error: 'Invalid id' });
        }
    }
}
