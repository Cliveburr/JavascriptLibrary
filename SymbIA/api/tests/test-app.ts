import 'reflect-metadata';
import express from 'express';
import { configureContainer } from '@symbia/core';
import { authRoutes } from '../src/routes/auth.routes.js';
import { memoriesRoutes } from '../src/routes/memories.routes.js';

export function createTestApp() {
    const app = express();

    // Configure DI container
    configureContainer();

    app.use(express.json());

    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Routes
    app.use('/auth', authRoutes);
    app.use('/memories', memoriesRoutes);

    return app;
}
