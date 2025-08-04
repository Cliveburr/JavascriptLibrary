import { Router, type IRouter } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { ServiceRegistry, AuthService } from '@symbia/core';

export function createAuthRoutes(): IRouter {
    const router: IRouter = Router();
    const registry = ServiceRegistry.getInstance();

    // Get services from registry
    const authService = registry.get<AuthService>('AuthService');

    // Create controller instance
    const authController = new AuthController(authService);

    // GET /auth/validate - Validar token
    router.get('/validate', ...authController.validate);

    // POST /auth/refresh - Refresh token
    router.post('/refresh', ...authController.refresh);

    // POST /auth/register
    router.post('/register', ...authController.register);

    // POST /auth/login
    router.post('/login', ...authController.login);

    return router;
}
