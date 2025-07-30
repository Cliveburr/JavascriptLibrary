import { Router, type IRouter } from 'express';
import { LlmSetController } from '../controllers/llm-sets.controller.js';
import { LlmController } from '../controllers/llm.controller.js';

const router: IRouter = Router();
const controller = new LlmSetController();
const llmController = new LlmController();

// GET /llm-sets - Get all LLM sets
router.get('/', controller.getAllSets.bind(controller));

// GET /llm-sets/providers - Get all available providers
router.get('/providers', controller.getProviders.bind(controller));

// GET /llm-sets/:id - Get specific LLM set by ID
router.get('/:id', controller.getSetById.bind(controller));

// POST /llm-sets/reload - Reload LLM sets (clear cache)
router.post('/reload', controller.reloadSets.bind(controller));

// POST /llm/generate-title
router.post('/generate-title', (req, res) => {
    llmController.generateTitle(req, res);
});

export { router as llmSetsRoutes };
