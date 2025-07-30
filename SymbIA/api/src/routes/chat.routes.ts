import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router: ExpressRouter = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// GET /chats?memoryId=... - Listar chats de uma memória
router.get('/', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.getChatsByMemory(req, res);
});

// GET /chats/:chatId/messages - Carregar mensagens de um chat
router.get('/:chatId/messages', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.getMessagesByChat(req, res);
});

// POST /chats - Criar novo chat
router.post('/', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.createChat(req, res);
});

// DELETE /chats/:chatId - Deletar chat
router.delete('/:chatId', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.deleteChat(req, res);
});

// POST /chats/:memoryId/messages
router.post('/:memoryId/messages', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.sendMessage(req, res);
});

// PATCH /chats/:chatId/title
router.patch('/:chatId/title', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.updateChatTitle(req, res);
});

// PATCH /chats/:chatId/order
router.patch('/:chatId/order', (req, res) => {
    const chatController = container.resolve(ChatController);
    chatController.updateChatOrder(req, res);
});

export { router as chatRoutes };
