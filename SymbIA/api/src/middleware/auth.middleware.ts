import type { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthService } from '@symbia/core';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                defaultMemoryId: string;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }

        const token = authHeader.substring(7);
        const authService = container.resolve(AuthService);

        const user = await authService.validateToken(token);

        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }

        req.user = {
            id: user.id,
            email: user.email,
            defaultMemoryId: user.defaultMemoryId
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
