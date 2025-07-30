import { Router, type IRouter } from 'express';
import { LlmSetController } from '../controllers/llm-sets.controller.js';
import { LlmController } from '../controllers/llm.controller.js';
import { ServiceRegistry, LlmSetService, LlmGateway, AuthService } from '@symbia/core';
import { createAuthMiddleware } from '../middleware/auth.middleware.js';

export function createLlmSetsRoutes(): IRouter {
    const router: IRouter = Router();
    const registry = ServiceRegistry.getInstance();

    // Get services from registry
    const llmSetService = registry.get<LlmSetService>('LlmSetService');
    const llmGateway = registry.get<LlmGateway>('LlmGateway');
    const authService = registry.get<AuthService>('AuthService');

    // Create controller instances
    const controller = new LlmSetController(llmSetService);
    const llmController = new LlmController(llmGateway, llmSetService);

    // GET /llm-sets - Get all LLM sets (public)
    router.get('/', controller.getAllSets.bind(controller));

    // GET /llm-sets/providers - Get all available providers (public)
    router.get('/providers', controller.getProviders.bind(controller));

    // GET /llm-sets/:id - Get specific LLM set by ID (public)
    router.get('/:id', controller.getSetById.bind(controller));

    // POST /llm-sets/reload - Reload LLM sets (clear cache) - requires auth
    router.post('/reload', createAuthMiddleware(authService), controller.reloadSets.bind(controller));

    // POST /llm/generate-title - requires auth
    router.post('/generate-title', createAuthMiddleware(authService), (req, res) => {
        llmController.generateTitle(req, res);
    });

    return router;
}
