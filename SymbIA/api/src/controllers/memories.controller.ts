import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';
import { MemoryService, MemoryValidationError, MemoryNotFoundError, CannotDeleteLastMemoryError } from '@symbia/core';
import type { MemoryDTO, CreateMemoryRequest } from '@symbia/interfaces';

const CreateMemoryRequestSchema = z.object({
    name: z.string().min(1)
});

const UpdateMemoryRequestSchema = z.object({
    name: z.string().min(1)
});

export class MemoriesController {

    constructor(
        private memoryService: MemoryService
    ) { }

    getMemories: RequestHandler = async (req: Request, res: Response) => {
        try {
            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;

            const memories = await this.memoryService.getMemoriesByUser(userId);

            const memoriesDTO: MemoryDTO[] = memories.map(memory => ({
                id: memory.id,
                userId: memory.userId,
                name: memory.name,
                createdAt: memory.createdAt.toISOString(),
                deletedAt: memory.deletedAt?.toISOString()
            }));

            res.json(memoriesDTO);
        } catch (error) {
            if (error instanceof MemoryValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            console.error('Get memories error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getMemoryById: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'Memory ID is required' });
                return;
            }

            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;

            const memory = await this.memoryService.getMemoryById(id);

            if (!memory || memory.userId !== userId) {
                res.status(404).json({ error: 'Memory not found' });
                return;
            }

            const memoryDTO: MemoryDTO = {
                id: memory.id,
                userId: memory.userId,
                name: memory.name,
                createdAt: memory.createdAt.toISOString(),
                deletedAt: memory.deletedAt?.toISOString()
            };

            res.json(memoryDTO);
        } catch (error) {
            if (error instanceof MemoryValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            console.error('Get memory by id error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    createMemory: RequestHandler[] = [
        processRequestBody(CreateMemoryRequestSchema),
        async (req: Request<{}, MemoryDTO, CreateMemoryRequest>, res: Response) => {
            try {
                const { name } = req.body;
                if (!req.user?.id) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const userId = req.user.id;

                const memory = await this.memoryService.createMemory(userId, name);

                const memoryDTO: MemoryDTO = {
                    id: memory.id,
                    userId: memory.userId,
                    name: memory.name,
                    createdAt: memory.createdAt.toISOString(),
                    deletedAt: memory.deletedAt?.toISOString()
                };

                res.status(201).json(memoryDTO);
            } catch (error) {
                if (error instanceof MemoryValidationError) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                console.error('Create memory error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    ];

    updateMemory: RequestHandler[] = [
        processRequestBody(UpdateMemoryRequestSchema),
        async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
                const { name } = req.body;

                if (!id) {
                    res.status(400).json({ error: 'Memory ID is required' });
                    return;
                }

                if (!req.user?.id) {
                    res.status(401).json({ error: 'User not authenticated' });
                    return;
                }
                const userId = req.user.id;

                // First check if memory exists and belongs to user
                const existingMemory = await this.memoryService.getMemoryById(id);
                if (!existingMemory || existingMemory.userId !== userId) {
                    res.status(404).json({ error: 'Memory not found' });
                    return;
                }

                const memory = await this.memoryService.updateMemory(id, name);

                if (!memory) {
                    res.status(404).json({ error: 'Memory not found' });
                    return;
                }

                const memoryDTO: MemoryDTO = {
                    id: memory.id,
                    userId: memory.userId,
                    name: memory.name,
                    createdAt: memory.createdAt.toISOString(),
                    deletedAt: memory.deletedAt?.toISOString()
                };

                res.json(memoryDTO);
            } catch (error) {
                if (error instanceof MemoryValidationError) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                if (error instanceof MemoryNotFoundError) {
                    res.status(404).json({ error: error.message });
                    return;
                }
                console.error('Update memory error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    ];

    deleteMemory: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'Memory ID is required' });
                return;
            }

            if (!req.user?.id) {
                res.status(401).json({ error: 'User not authenticated' });
                return;
            }
            const userId = req.user.id;

            // First check if memory exists and belongs to user
            const existingMemory = await this.memoryService.getMemoryById(id);
            if (!existingMemory || existingMemory.userId !== userId) {
                res.status(404).json({ error: 'Memory not found' });
                return;
            }

            await this.memoryService.deleteMemory(id);
            res.status(204).send();

        } catch (error) {
            if (error instanceof MemoryValidationError) {
                res.status(400).json({ error: error.message });
                return;
            }
            if (error instanceof MemoryNotFoundError) {
                res.status(404).json({ error: error.message });
                return;
            }
            if (error instanceof CannotDeleteLastMemoryError) {
                res.status(400).json({ error: error.message });
                return;
            }
            console.error('Delete memory error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}
