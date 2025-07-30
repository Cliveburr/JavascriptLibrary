import dotenv from 'dotenv';
import express, { type Express } from 'express';
import { configureContainer, ConfigService } from '@symbia/core';

// Load environment variables
dotenv.config();

async function startServer() {
  try {
    // Configure services registry (this will validate all environment variables)
    const registry = configureContainer();

    // Get config service to ensure validation passed
    const configService = registry.get<ConfigService>('ConfigService');
    const config = configService.get();

    console.log('✅ Configuration loaded and validated successfully');
    console.log(`📊 Server will run on port: ${config.port}`);
    console.log(`🗄️  MongoDB URI: ${config.mongodbUri}`);
    console.log(`🧠 Ollama URL: ${config.ollamaBaseUrl}`);
    console.log(`🔍 Qdrant URL: ${config.qdrantUrl}`);

    // Import routes AFTER configuration is loaded
    const { createAuthRoutes } = await import('./routes/auth.routes.js');
    const { createMemoriesRoutes } = await import('./routes/memories.routes.js');
    const { createChatRoutes } = await import('./routes/chat.routes.js');
    const { createLlmSetsRoutes } = await import('./routes/llm-sets.routes.js');

    const app: Express = express();
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
    app.use('/auth', createAuthRoutes());
    app.use('/memories', createMemoriesRoutes());
    app.use('/chats', createChatRoutes());
    app.use('/llm-sets', createLlmSetsRoutes());

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    return app;

  } catch (error) {
    console.error('❌ Configuration validation failed:', error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(console.error);

export { startServer };
