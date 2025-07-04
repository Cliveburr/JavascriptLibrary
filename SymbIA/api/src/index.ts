import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { LLMManager } from './services/llm.service';
import { AuthService } from './services/auth.service';
import { memoryRoutes } from './routes/memory.routes';
import { chatRoutes } from './routes/chat.routes';
import { authRoutes } from './routes/auth.routes';
import './models/chat.model'; // Registrar o modelo Chat
import jwt from 'jsonwebtoken';

dotenv.config();

// Verificar todas as variáveis de ambiente obrigatórias
const requiredEnvVars = [
  'MONGODB_URI',
  'PORT', 
  'NODE_ENV',
  'JWT_SECRET',
  'OLLAMA_HOST'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Configuração de conexão com MongoDB
const connectToMongoDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI!;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB successfully');
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Conectar ao MongoDB
connectToMongoDB();

const app = express();
const PORT: number = parseInt(process.env.PORT!, 10);
const llmManager = new LLMManager();
const authService = new AuthService();

// Middleware de autenticação JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    res.status(500).json({ message: 'Server configuration error' });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, secret) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interface para respostas padronizadas
interface ApiResponse<T = any> {
  /**
   * Mensagem descritiva da resposta
   */
  message?: string;

  /**
   * Dados retornados pela API
   */
  data?: T;

  /**
   * Mensagem de erro quando ocorre uma falha
   */
  error?: string;

  /**
   * Estado atual da API (OK, ERROR, etc)
   */
  status?: string;

  /**
   * Versão da API
   */
  version?: string;

  /**
   * Data e hora da resposta
   */
  timestamp?: string;

  /**
   * Tempo de execução do servidor em segundos
   */
  uptime?: number;

  /**
   * Caminho da rota acessada
   */
  path?: string;
}

// Rotas
app.get('/', (req: Request, res: Response): void => {
  const response: ApiResponse = {
    message: 'SymbIA API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

app.get('/api/health', (req: Request, res: Response): void => {
  const response: ApiResponse = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    data: {
      database: {
        status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        name: mongoose.connection.name || 'symbia',
        host: mongoose.connection.host || 'localhost'
      },
      environment: process.env.NODE_ENV
    }
  };
  res.json(response);
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de memórias (protegidas por autenticação)
app.use('/api/memories', authenticateToken, memoryRoutes);

// Rotas de chats (protegidas por autenticação)
app.use('/api/chats', authenticateToken, chatRoutes);

// Get available models
app.get('/api/models', async (req: Request, res: Response): Promise<void> => {
  try {
    const provider = await llmManager.getAvailableProvider();
    if (!provider) {
      res.status(503).json({ error: 'No LLM provider available' });
      return;
    }

    const models = await provider.getAvailableModels();
    res.json({ models });
  } catch (error) {
    console.error('Models endpoint error:', error);
    res.status(500).json({ error: 'Failed to get models' });
  }
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const errorResponse: ApiResponse = {
    error: 'Something went wrong!',
    message: err.message
  };
  res.status(500).json(errorResponse);
});

// Middleware para rotas não encontradas
app.use((req: Request, res: Response): void => {
  const notFoundResponse: ApiResponse = {
    error: 'Route not found',
    path: req.originalUrl
  };
  res.status(404).json(notFoundResponse);
});

// Check if this is being run directly (server mode) or as a module
const isDirectRun = require.main === module;

if (isDirectRun) {
  // Start the server normally
  startServer();
} else {
  // When imported as a module, just export the app
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`📝 API endpoints:`);
    console.log(`   GET  /`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   GET  /api/models`);
    console.log('');
    console.log('💡 Server running in production mode');
  });
}

export default app;
