import 'reflect-metadata';
import express, { type Express } from 'express';
import { configureContainer } from '@symbia/core';
import { authRoutes } from './routes/auth.routes.js';
import { memoriesRoutes } from './routes/memories.routes.js';
import { chatRoutes } from './routes/chat.routes.js';

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Configure DI container
configureContainer();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/memories', memoriesRoutes);
app.use('/chats', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
