import { Router, type IRouter } from 'express';
import { container } from 'tsyringe';
import { MemoriesController } from '../controllers/memories.controller.js';
import { MemoryService } from '@symbia/core';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: IRouter = Router();

// Ensure MemoryService is registered before resolving MemoriesController
container.registerSingleton(MemoryService);

// Get controller instance from DI container
const memoriesController = container.resolve(MemoriesController);

// All memory endpoints require authentication
router.use(authMiddleware);

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

export { router as memoriesRoutes };
