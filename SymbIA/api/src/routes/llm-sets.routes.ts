import { Router, type IRouter } from 'express';
import { LlmSetController } from '../controllers/llm-sets.controller.js';
import { LlmController } from '../controllers/llm.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: IRouter = Router();
const controller = new LlmSetController();
const llmController = new LlmController();

// GET /llm-sets - Get all LLM sets (public)
router.get('/', controller.getAllSets.bind(controller));

// GET /llm-sets/providers - Get all available providers (public)
router.get('/providers', controller.getProviders.bind(controller));

// GET /llm-sets/:id - Get specific LLM set by ID (public)
router.get('/:id', controller.getSetById.bind(controller));

// POST /llm-sets/reload - Reload LLM sets (clear cache) - requires auth
router.post('/reload', authMiddleware, controller.reloadSets.bind(controller));

// POST /llm/generate-title - requires auth
router.post('/generate-title', authMiddleware, (req, res) => {
    llmController.generateTitle(req, res);
});

export { router as llmSetsRoutes };
