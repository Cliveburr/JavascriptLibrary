import { injectable, inject } from 'tsyringe';
import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';
import { AuthService } from '@symbia/core';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@symbia/interfaces';

const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

const RegisterRequestSchema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

@injectable()
export class AuthController {

    constructor(
        @inject(AuthService) private authService: AuthService
    ) { }

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
                        id: authResult.user.id,
                        username: authResult.user.username,
                        email: authResult.user.email,
                        defaultMemoryId: authResult.user.defaultMemoryId
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
                            id: authResult.user.id,
                            email: authResult.user.email,
                            defaultMemoryId: authResult.user.defaultMemoryId
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
}
