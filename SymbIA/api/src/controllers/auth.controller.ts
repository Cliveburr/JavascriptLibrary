import { injectable, inject } from 'tsyringe';
import type { Request, Response, RequestHandler } from 'express';
import { z } from 'zod';
import { processRequestBody } from 'zod-express-middleware';
import { AuthService } from '@symbia/core';
import type { LoginRequest, LoginResponse } from '@symbia/interfaces';

const LoginRequestSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

@injectable()
export class AuthController {

    constructor(
        @inject(AuthService) private authService: AuthService
    ) { }

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
                    } as any);
                }
            } catch (error) {
                console.error('Login error:', error);
                res.status(500).json({
                    error: 'Internal server error'
                } as any);
            }
        }
    ];
}
