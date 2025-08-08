import type { Router as ExpressRouter } from 'express';
import { Router } from 'express';
import { ServiceRegistry, ConfigService, DebugService } from '@symbia/core';
import { DebugController } from '../controllers/debug.controller.js';

export function createDebugRoutes(): ExpressRouter | null {
    const registry = ServiceRegistry.getInstance();
    const config = registry.get<ConfigService>('ConfigService');
    if (!config.isDebugEnabled() || !registry.has('DebugService')) {
        return null;
    }

    const router: ExpressRouter = Router();
    const debugService = registry.get<DebugService>('DebugService');
    const controller = new DebugController(debugService);

    router.get('/', (req, res) => controller.list(req, res));
    router.get('/:chatId', (req, res) => controller.get(req, res));
    router.delete('/', (req, res) => controller.clear(req, res));

    return router;
}
