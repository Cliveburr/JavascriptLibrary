import { Router, type IRouter } from 'express';
import { MemoriesController } from '../controllers/memories.controller.js';
import { ServiceRegistry, MemoryService, AuthService } from '@symbia/core';
import { createAuthMiddleware } from '../middleware/auth.middleware.js';

export function createMemoriesRoutes(): IRouter {
    const router: IRouter = Router();
    const registry = ServiceRegistry.getInstance();

    // Get services from registry
    const memoryService = registry.get<MemoryService>('MemoryService');
    const authService = registry.get<AuthService>('AuthService');

    // Create controller instance
    const memoriesController = new MemoriesController(memoryService);

    // All memory endpoints require authentication
    router.use(createAuthMiddleware(authService));

    // GET /memories
    router.get('/', memoriesController.getMemories);

    // GET /memories/:id
    router.get('/:id', memoriesController.getMemoryById);

    // POST /memories
    router.post('/', ...memoriesController.createMemory);

    // PUT /memories/:id
    router.put('/:id', ...memoriesController.updateMemory);

    // DELETE /memories/:id
    router.delete('/:id', memoriesController.deleteMemory);

    return router;
}
