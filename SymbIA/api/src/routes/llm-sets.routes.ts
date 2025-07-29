import { Router, type IRouter } from 'express';
import { LlmSetController } from '../controllers/llm-sets.controller.js';

const router: IRouter = Router();
const controller = new LlmSetController();

// GET /llm-sets - Get all LLM sets
router.get('/', controller.getAllSets.bind(controller));

// GET /llm-sets/providers - Get all available providers
router.get('/providers', controller.getProviders.bind(controller));

// GET /llm-sets/:id - Get specific LLM set by ID
router.get('/:id', controller.getSetById.bind(controller));

// POST /llm-sets/reload - Reload LLM sets (clear cache)
router.post('/reload', controller.reloadSets.bind(controller));

export { router as llmSetsRoutes };
