import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller.js';
import { ServiceRegistry, ThoughtCycleService, ChatService, AuthService, LlmSetService, PromptForUseService, LlmGateway } from '@symbia/core';
import { createAuthMiddleware } from '../middleware/auth.middleware.js';

export function createChatRoutes(): ExpressRouter {
    const router: ExpressRouter = Router();
    const registry = ServiceRegistry.getInstance();

    // Get services from registry
    const thoughtCycleService = registry.get<ThoughtCycleService>('ThoughtCycleService');
    const chatService = registry.get<ChatService>('ChatService');
    const authService = registry.get<AuthService>('AuthService');
    const llmSetService = registry.get<LlmSetService>('LlmSetService');
    const promptForUseService = registry.get<PromptForUseService>('PromptForUseService');
    const llmGateway = registry.get<LlmGateway>('LlmGateway');

    // Create controller instance
    const chatController = new ChatController(thoughtCycleService, chatService, llmSetService, authService, promptForUseService, llmGateway);

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
