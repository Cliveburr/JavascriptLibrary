import 'reflect-metadata';
import express, { type Express } from 'express';
import { configureContainer } from '@symbia/core';
import { authRoutes } from './routes/auth.routes.js';
import { memoriesRoutes } from './routes/memories.routes.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
