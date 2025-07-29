import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { container } from 'tsyringe';
import { MessageController } from '../controllers/message.controller.js';

const router: ExpressRouter = Router();

// POST /messages/:memoryId
router.post('/:memoryId', (req, res) => {
    const messageController = container.resolve(MessageController);
    messageController.sendMessage(req, res);
});

export { router as messageRoutes };
