import type { Request, Response } from 'express';
import { LlmSetService } from '@symbia/core';
import type { LlmSetListResponse } from '@symbia/interfaces';

export class LlmSetController {
    private llmSetService: LlmSetService;

    constructor(llmSetService: LlmSetService) {
        this.llmSetService = llmSetService;
    }

    /**
     * GET /llm-sets
     * Returns all available LLM sets
     */
    async getAllSets(_req: Request, res: Response): Promise<void> {
        try {
            const sets = await this.llmSetService.loadLlmSets();

            const response: LlmSetListResponse = {
                sets
            };

            res.json(response);
        } catch (error) {
            console.error('Error getting LLM sets:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to load LLM sets'
            });
        }
    }

    /**
     * GET /llm-sets/:id
     * Returns a specific LLM set by ID
     */
    async getSetById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    error: 'Bad request',
                    message: 'LLM set ID is required'
                });
                return;
            }

            const set = await this.llmSetService.getLlmSetById(id);

            if (!set) {
                res.status(404).json({
                    error: 'Not found',
                    message: `LLM set with ID '${id}' not found`
                });
                return;
            }

            res.json(set);
        } catch (error) {
            console.error('Error getting LLM set by ID:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to load LLM set'
            });
        }
    }

    /**
     * GET /llm-sets/providers
     * Returns all available providers
     */
    async getProviders(_req: Request, res: Response): Promise<void> {
        try {
            const providers = await this.llmSetService.getAvailableProviders();

            res.json({ providers });
        } catch (error) {
            console.error('Error getting providers:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to load providers'
            });
        }
    }

    /**
     * POST /llm-sets/reload
     * Clear cache and reload LLM sets
     */
    async reloadSets(_req: Request, res: Response): Promise<void> {
        try {
            this.llmSetService.clearCache();
            const sets = await this.llmSetService.loadLlmSets();

            const response: LlmSetListResponse = {
                sets
            };

            res.json({
                message: 'LLM sets reloaded successfully',
                ...response
            });
        } catch (error) {
            console.error('Error reloading LLM sets:', error);
            res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to reload LLM sets'
            });
        }
    }
}
