import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'vitest';
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

describe('MemoriesController Simple Test', () => {
    let app: express.Application;
    let memoryService: MemoryService;

    beforeEach(async () => {
        // Create memory service directly
        memoryService = new MemoryService();

        // Get controller - pass service directly
        const controller = new MemoriesController(memoryService);

        app = express();
        app.use(express.json());
        app.use(mockAuthMiddleware);
        app.post('/memories', ...controller.createMemory);
        app.get('/memories', controller.getMemories);
    });

    it('should work with direct instance', async () => {
        // Test that controller uses our memory service instance
        console.log('Creating memory directly in service...');
        const directMemory = await memoryService.createMemory('test-user-1', 'Direct Memory');
        console.log('Direct memory created:', directMemory.id);

        console.log('Getting memories through service...');
        const directMemories = await memoryService.getMemoriesByUser('test-user-1');
        console.log('Direct memories count:', directMemories.length);

        console.log('Getting memories through controller...');
        const response = await request(app)
            .get('/memories')
            .expect(200);

        console.log('Controller response:', response.body);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].name).toBe('Direct Memory');
    });

    it('should create through controller', async () => {
        const response = await request(app)
            .post('/memories')
            .send({ name: 'Controller Memory' })
            .expect(201);

        expect(response.body.name).toBe('Controller Memory');

        // Verify it exists in our service instance
        const memories = await memoryService.getMemoriesByUser('test-user-1');
        expect(memories).toHaveLength(1);
        expect(memories[0].name).toBe('Controller Memory');
    });
});
