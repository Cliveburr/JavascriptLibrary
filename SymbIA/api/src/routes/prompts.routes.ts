import { Router, type IRouter } from 'express';
import { ServiceRegistry, PromptService, AuthService } from '@symbia/core';
import { createAuthMiddleware } from '../middleware/auth.middleware.js';
import { PromptsController } from '../controllers/prompts.controller.js';

export function createPromptsRoutes(): IRouter {
    const router: IRouter = Router();
    const registry = ServiceRegistry.getInstance();

    const promptService = registry.get<PromptService>('PromptService');
    const authService = registry.get<AuthService>('AuthService');
    const controller = new PromptsController(promptService);

    // List summaries of prompt sets (public for now)
    router.get('/sets', controller.listSummaries.bind(controller));
    // Get by id
    router.get('/sets/:id', controller.getById.bind(controller));
    // Create, Update, Delete - protected
    router.post('/sets', createAuthMiddleware(authService), controller.create.bind(controller));
    router.put('/sets/:id', createAuthMiddleware(authService), controller.update.bind(controller));
    router.delete('/sets/:id', createAuthMiddleware(authService), controller.remove.bind(controller));
    // Set current active prompt set
    router.post('/sets/:id/set-current', createAuthMiddleware(authService), controller.setCurrent.bind(controller));

    return router;
}
