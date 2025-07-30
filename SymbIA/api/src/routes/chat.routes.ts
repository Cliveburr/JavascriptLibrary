import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { ServiceRegistry, ThoughtCycleService, ChatService, AuthService } from '@symbia/core';
import { createAuthMiddleware } from '../middleware/auth.middleware.js';

export function createChatRoutes(): ExpressRouter {
    const router: ExpressRouter = Router();
    const registry = ServiceRegistry.getInstance();

    // Get services from registry
    const thoughtCycleService = registry.get<ThoughtCycleService>('ThoughtCycleService');
    const chatService = registry.get<ChatService>('ChatService');
    const authService = registry.get<AuthService>('AuthService');

    // Create controller instance
    const chatController = new ChatController(thoughtCycleService, chatService);

    // Apply authentication middleware to all routes
    router.use(createAuthMiddleware(authService));

    // GET /chats?memoryId=... - Listar chats de uma memória
    router.get('/', (req, res) => {
        chatController.getChatsByMemory(req, res);
    });

    // GET /chats/:chatId/messages - Carregar mensagens de um chat
    router.get('/:chatId/messages', (req, res) => {
        chatController.getMessagesByChat(req, res);
    });

    // POST /chats - Criar novo chat
    router.post('/', (req, res) => {
        chatController.createChat(req, res);
    });

    // DELETE /chats/:chatId - Deletar chat
    router.delete('/:chatId', (req, res) => {
        chatController.deleteChat(req, res);
    });

    // POST /chats/:memoryId/messages
    router.post('/:memoryId/messages', (req, res) => {
        chatController.sendMessage(req, res);
    });

    // PATCH /chats/:chatId/title
    router.patch('/:chatId/title', (req, res) => {
        chatController.updateChatTitle(req, res);
    });

    // PATCH /chats/:chatId/order
    router.patch('/:chatId/order', (req, res) => {
        chatController.updateChatOrder(req, res);
    });

    return router;
}
