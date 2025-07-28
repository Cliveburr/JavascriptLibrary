import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { container } from 'tsyringe';
import { MemoriesController } from '../src/controllers/memories.controller.js';
import { MemoryService } from '@symbia/core';

// Mock auth middleware for testing
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-1' };
    next();
};

describe('MemoriesController Integration', () => {
    let app: express.Application;
    let memoryService: MemoryService;

    beforeEach(async () => {
        // Clear container and create fresh instances
        container.clearInstances();

        // Create a new memory service instance for each test
        memoryService = new MemoryService();
        container.registerInstance(MemoryService, memoryService);

        const controller = container.resolve(MemoriesController);

        app = express();
        app.use(express.json());
        app.use(mockAuthMiddleware);

        // Setup routes
        app.get('/memories', controller.getMemories);
        app.get('/memories/:id', controller.getMemoryById);
        app.post('/memories', ...controller.createMemory);
        app.put('/memories/:id', ...controller.updateMemory);
        app.delete('/memories/:id', controller.deleteMemory);
    });

    afterEach(async () => {
        // Clear memories for next test by calling the clearAll method if available
        if ('clearAll' in memoryService && typeof memoryService.clearAll === 'function') {
            await (memoryService as any).clearAll();
        }
    });

    describe('GET /memories', () => {
        it('should return empty array when user has no memories', async () => {
            const response = await request(app)
                .get('/memories')
                .expect(200);

            expect(response.body).toEqual([]);
        });

        it('should return user memories', async () => {
            // Create some memories
            await memoryService.createMemory('test-user-1', 'Memory 1');
            await new Promise(resolve => setTimeout(resolve, 10)); // Ensure different timestamps
            await memoryService.createMemory('test-user-1', 'Memory 2');
            await memoryService.createMemory('other-user', 'Other Memory');

            const response = await request(app)
                .get('/memories')
                .expect(200);

            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toMatchObject({
                name: 'Memory 2',
                userId: 'test-user-1',
            });
            expect(response.body[1]).toMatchObject({
                name: 'Memory 1',
                userId: 'test-user-1',
            });
        });
    });

    describe('GET /memories/:id', () => {
        it('should return memory by id', async () => {
            const memory = await memoryService.createMemory('test-user-1', 'Test Memory');

            const response = await request(app)
                .get(`/memories/${memory.id}`)
                .expect(200);

            expect(response.body).toMatchObject({
                id: memory.id,
                name: 'Test Memory',
                userId: 'test-user-1',
            });
        });

        it('should return 404 for non-existent memory', async () => {
            const response = await request(app)
                .get('/memories/non-existent')
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 404 for memory belonging to other user', async () => {
            const memory = await memoryService.createMemory('other-user', 'Other Memory');

            const response = await request(app)
                .get(`/memories/${memory.id}`)
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 200 for route without id (hits GET /memories instead)', async () => {
            await request(app)
                .get('/memories/')
                .expect(200); // This actually hits the GET /memories route
        });
    });

    describe('POST /memories', () => {
        it('should create a memory successfully', async () => {
            const response = await request(app)
                .post('/memories')
                .send({ name: 'New Memory' })
                .expect(201);

            expect(response.body).toMatchObject({
                name: 'New Memory',
                userId: 'test-user-1',
            });
            expect(response.body.id).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
        });

        it('should return 400 for missing name', async () => {
            const response = await request(app)
                .post('/memories')
                .send({})
                .expect(400);

            // zod-express-middleware returns different error format
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return 400 for empty name', async () => {
            const response = await request(app)
                .post('/memories')
                .send({ name: '' })
                .expect(400);

            // zod-express-middleware returns different error format
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PUT /memories/:id', () => {
        it('should update memory successfully', async () => {
            const memory = await memoryService.createMemory('test-user-1', 'Original Name');

            const response = await request(app)
                .put(`/memories/${memory.id}`)
                .send({ name: 'Updated Name' })
                .expect(200);

            expect(response.body).toMatchObject({
                id: memory.id,
                name: 'Updated Name',
                userId: 'test-user-1',
            });
        });

        it('should return 404 for non-existent memory', async () => {
            const response = await request(app)
                .put('/memories/non-existent')
                .send({ name: 'Updated Name' })
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 404 for memory belonging to other user', async () => {
            const memory = await memoryService.createMemory('other-user', 'Other Memory');

            const response = await request(app)
                .put(`/memories/${memory.id}`)
                .send({ name: 'Updated Name' })
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 400 for missing name', async () => {
            const memory = await memoryService.createMemory('test-user-1', 'Original Name');

            const response = await request(app)
                .put(`/memories/${memory.id}`)
                .send({})
                .expect(400);

            // zod-express-middleware returns different error format
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('DELETE /memories/:id', () => {
        it('should delete memory when user has multiple memories', async () => {
            const memory1 = await memoryService.createMemory('test-user-1', 'Memory 1');
            const memory2 = await memoryService.createMemory('test-user-1', 'Memory 2');

            await request(app)
                .delete(`/memories/${memory1.id}`)
                .expect(204);

            // Verify memory is deleted
            const memories = await memoryService.getMemoriesByUser('test-user-1');
            expect(memories).toHaveLength(1);
            expect(memories[0].id).toBe(memory2.id);
        });

        it('should return 400 when trying to delete last memory', async () => {
            const memory = await memoryService.createMemory('test-user-1', 'Only Memory');

            const response = await request(app)
                .delete(`/memories/${memory.id}`)
                .expect(400);

            expect(response.body).toMatchObject({
                error: 'Cannot delete the last memory. Users must have at least one active memory.'
            });

            // Verify memory still exists
            const memories = await memoryService.getMemoriesByUser('test-user-1');
            expect(memories).toHaveLength(1);
        });

        it('should return 404 for non-existent memory', async () => {
            const response = await request(app)
                .delete('/memories/non-existent')
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 404 for memory belonging to other user', async () => {
            const memory = await memoryService.createMemory('other-user', 'Other Memory');

            const response = await request(app)
                .delete(`/memories/${memory.id}`)
                .expect(404);

            expect(response.body).toMatchObject({
                error: 'Memory not found'
            });
        });

        it('should return 404 for route without id', async () => {
            const response = await request(app)
                .delete('/memories/')
                .expect(404); // Express returns 404 for routes without proper parameters
        });
    });
});
