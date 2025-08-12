import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ServiceRegistry, ConfigService, ChatService } from '@symbia/core';
import { DebugController } from '../controllers/debug.controller.js';

export function createDebugRoutes(): ExpressRouter | null {
    const registry = ServiceRegistry.getInstance();
    const config = registry.get<ConfigService>('ConfigService');
    if (!config.isDebugEnabled()) {
        return null;
    }

    const router: ExpressRouter = Router();
    const chatService = registry.get<ChatService>('ChatService');
    const controller = new DebugController(chatService);

    router.get('/', (req, res) => controller.list(req, res));
    router.get('/:chatId', (req, res) => controller.get(req, res));

    return router;
}
