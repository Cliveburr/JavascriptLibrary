import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../controllers/chat.controller.js';

const router: ExpressRouter = Router();

// POST /chats/:memoryId/messages
router.post('/:memoryId/messages', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.sendMessage(req, res);
});

export { router as chatRoutes };
