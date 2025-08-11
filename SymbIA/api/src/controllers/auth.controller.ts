import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';
import { AuthService } from '@symbia/core';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../types/api.js';

const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const RegisterRequestSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1)
});

export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    validate: RequestHandler[] = [
        async (req: Request, res: Response) => {
            try {
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    res.status(401).json({ error: 'No token provided' });
                    return;
                }

                const token = authHeader.substring(7);
                const user = await this.authService.validateToken(token);

                if (!user) {
                    res.status(401).json({ error: 'Invalid token' });
                    return;
                }

                res.json({
                    valid: true,
                    user: {
                        id: user._id.toString(),
                        email: user.email
                    }
                });
            } catch (error) {
                console.error('Token validation error:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    ];

    register: RequestHandler[] = [
        processRequestBody(RegisterRequestSchema),
        async (req: Request<{}, RegisterResponse, RegisterRequest>, res: Response) => {
            try {
                const { username, email, password } = req.body;

                const authResult = await this.authService.register(username, email, password);

                const response: RegisterResponse = {
                    token: authResult.token,
                    refreshToken: authResult.refreshToken,
                    user: {
                        id: authResult.user._id.toString(),
                        username: authResult.user.username,
                        email: authResult.user.email
                    },
                    createdMemory: {
                        id: authResult.createdMemory!._id.toString(),
                        name: authResult.createdMemory!.name
                    }
                };

                res.status(201).json(response);
            } catch (error: any) {
                if (error.message.includes('already exists')) {
                    res.status(409).json({
                        error: 'Registration failed',
                        message: error.message
                    });
                } else {
                    res.status(500).json({
                        error: 'Registration failed',
                        message: 'Internal server error'
                    });
                }
            }
        }
    ];

    login: RequestHandler[] = [
        processRequestBody(LoginRequestSchema),
        async (req: Request<{}, LoginResponse, LoginRequest>, res: Response) => {
            try {
                const { email, password } = req.body;

                const authResult = await this.authService.login(email, password);

                if (authResult) {
                    const response: LoginResponse = {
                        token: authResult.token,
                        refreshToken: authResult.refreshToken,
                        user: {
                            id: authResult.user._id.toString(),
                            email: authResult.user.email
                        }
                    };

                    res.json(response);
                } else {
                    res.status(401).json({
                        error: 'Invalid credentials'
                    });
                }
            } catch {
                res.status(500).json({
                    error: 'Login failed',
                    message: 'Internal server error'
                });
            }
        }
    ];

    refresh: RequestHandler[] = [
        processRequestBody(RefreshTokenRequestSchema),
        async (req: Request<{}, LoginResponse, { refreshToken: string; }>, res: Response) => {
            try {
                const { refreshToken } = req.body;

                const refreshResult = await this.authService.refreshToken(refreshToken);

                if (refreshResult) {
                    const response: LoginResponse = {
                        token: refreshResult.token,
                        refreshToken: refreshResult.refreshToken,
                        user: {
                            id: refreshResult.user._id.toString(),
                            email: refreshResult.user.email
                        }
                    };

                    res.json(response);
                } else {
                    res.status(401).json({
                        error: 'Invalid refresh token'
                    });
                }
            } catch (error) {
                console.error('Refresh token error:', error);
                res.status(500).json({
                    error: 'Token refresh failed',
                    message: 'Internal server error'
                });
            }
        }
    ];
}
