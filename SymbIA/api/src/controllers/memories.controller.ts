import { injectable, inject } from 'tsyringe';
import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';
import { MemoryService } from '@symbia/core';
import type { MemoryDTO, CreateMemoryRequest } from '@symbia/interfaces';

const CreateMemoryRequestSchema = z.object({
    name: z.string().min(1)
});

@injectable()
export class MemoriesController {

    constructor(
        @inject(MemoryService) private memoryService: MemoryService
    ) { }

    getMemories: RequestHandler = async (req: Request, res: Response) => {
        try {
            const userId = req.user?.id || 'user-1';

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
            console.error('Get memories error:', error);
            res.status(500).json({
                error: 'Internal server error'
            } as any);
        }
    };

    createMemory: RequestHandler[] = [
        processRequestBody(CreateMemoryRequestSchema),
        async (req: Request<{}, MemoryDTO, CreateMemoryRequest>, res: Response) => {
            try {
                const { name } = req.body;

                const userId = req.user?.id || 'user-1';

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
                console.error('Create memory error:', error);
                res.status(500).json({
                    error: 'Internal server error'
                } as any);
            }
        }
    ];
}
