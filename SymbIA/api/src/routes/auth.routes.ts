import { Router, type IRouter } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '@symbia/core';

const router: IRouter = Router();

// Ensure AuthService is registered before resolving AuthController
container.registerSingleton(AuthService);

// Get controller instance from DI container
const authController = container.resolve(AuthController);

// POST /auth/register
router.post('/register', ...authController.register);

// POST /auth/login
router.post('/login', ...authController.login);

export { router as authRoutes };
