import 'reflect-metadata';
import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { configureContainer, ConfigService } from '@symbia/core';
import { container } from 'tsyringe';

// Load environment variables
dotenv.config();

try {
    // Configure DI container (this will validate all environment variables)
    configureContainer();
    
    // Get config service to ensure validation passed
    const configService = container.resolve(ConfigService);
    const config = configService.get();
    
    console.log('✅ Configuration loaded and validated successfully');
    console.log(`📊 Server will run on port: ${config.port}`);
    console.log(`🗄️  MongoDB URI: ${config.mongodbUri}`);
    console.log(`🧠 Ollama URL: ${config.ollamaBaseUrl}`);
    console.log(`🔍 Qdrant URL: ${config.qdrantUrl}`);
    
} catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
}

// Import routes AFTER configuration is loaded
const { authRoutes } = await import('./routes/auth.routes.js');
const { memoriesRoutes } = await import('./routes/memories.routes.js');
const { chatRoutes } = await import('./routes/chat.routes.js');
const { messageRoutes } = await import('./routes/message.routes.js');
const { llmSetsRoutes } = await import('./routes/llm-sets.routes.js');const app: Express = express();
const configService = container.resolve(ConfigService);
const PORT = configService.getServerConfig().port;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

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
app.use('/messages', messageRoutes);
app.use('/llm-sets', llmSetsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
