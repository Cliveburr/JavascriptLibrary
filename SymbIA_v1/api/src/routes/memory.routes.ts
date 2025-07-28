import { Router } from 'express';
import { MemoryController } from '../controllers/memory.controller';

const router = Router();
const memoryController = new MemoryController();

router.post('/', memoryController.createMemory);
router.get('/', memoryController.getMemories);
router.get('/:id', memoryController.getMemory);
router.delete('/:id', memoryController.deleteMemory);

export { router as memoryRoutes };
