import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { LLMManager } from './services/llm.service';
import { ThoughtCycleService } from './services/thought-cycle.service';
import { AuthService } from './services/auth.service';
import { memoryRoutes } from './routes/memory.routes';
import { chatRoutes } from './routes/chat.routes';
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
const thoughtCycleService = new ThoughtCycleService(llmManager);
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
app.post('/api/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    console.log('Registration attempt for username:', username);
    console.log('MongoDB connection state:', mongoose.connection.readyState);
    
    // Verificar se o MongoDB está conectado
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB not connected. Connection state:', mongoose.connection.readyState);
      res.status(503).json({ 
        error: 'Database connection unavailable',
        details: 'Please try again later'
      });
      return;
    }
    
    if (!username || !password) {
      console.log('Missing username or password');
      res.status(400).json({ 
        error: 'Username and password are required' 
      });
      return;
    }

    if (username.length < 3) {
      console.log('Username too short');
      res.status(400).json({ 
        error: 'Username must be at least 3 characters long' 
      });
      return;
    }

    if (password.length < 6) {
      console.log('Password too short');
      res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
      return;
    }
    
    const newUser = await authService.register({ username, password });
    
    console.log('User registered successfully:', newUser.username);
    
    const response: ApiResponse = {
      message: 'User registered successfully',
      data: {
        username: newUser.username,
        id: newUser._id
      },
      timestamp: new Date().toISOString()
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Register endpoint error:', error);
    
    // Tratar erro de usuário duplicado
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      res.status(400).json({ 
        error: 'Username already exists. Please choose a different username.',
        details: 'This username is already taken'
      });
      return;
    }
    
    // Tratar erro de validação do Mongoose
    if (error instanceof Error && error.name === 'ValidationError') {
      res.status(400).json({ 
        error: 'Validation error',
        details: error.message
      });
      return;
    }
    
    res.status(400).json({ 
      error: 'Failed to register user',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({ 
        error: 'Username and password are required' 
      });
      return;
    }
    
    const result = await authService.login({ username, password });
    
    if (!result) {
      res.status(401).json({ 
        error: 'Invalid credentials' 
      });
      return;
    }
    
    const response: ApiResponse = {
      message: 'Login successful',
      data: {
        token: result.token
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Login endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Rota para obter dados do usuário autenticado
app.get('/api/auth/me', async (req: Request, res: Response): Promise<void> => {
  try {
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
      const user = await authService.getUserById(decoded.id);
      
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const responseData = {
        success: true,
        data: {
          id: user._id,
          username: user.username,
          name: user.username // Usando username como nome por enquanto
        }
      };
      res.status(200).json(responseData);
    } catch (jwtError) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error getting user info', error });
  }
});

// Rotas de memórias (protegidas por autenticação)
app.use('/api/memories', authenticateToken, memoryRoutes);

// Rotas de chats (protegidas por autenticação)
app.use('/api/chats', authenticateToken, chatRoutes);

// Chat streaming endpoint
app.post('/api/chat/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, model = 'llama3:8b' } = req.body;
    
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const provider = await llmManager.getAvailableProvider();
    if (!provider) {
      res.status(503).json({ error: 'No LLM provider available' });
      return;
    }

    // Set up server-sent events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    });

    try {
      for await (const chunk of provider.generateResponse(message, model)) {
        console.log('Server yielding chunk:', JSON.stringify(chunk)); // Debug log
        const data = JSON.stringify({ content: chunk });
        res.write(`data: ${data}\n\n`);
      }
      
      // Send end signal
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error('Streaming error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorData = JSON.stringify({ error: errorMessage });
      res.write(`data: ${errorData}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

// Endpoint para executar um ciclo de pensamento completo
app.post('/api/thought/cycle', async (req: Request, res: Response): Promise<void> => {
  try {
    const { originalMessage, previousMessages = [], executedActions = [] } = req.body;
    
    if (!originalMessage || typeof originalMessage !== 'string') {
      res.status(400).json({ 
        error: 'Original message is required and must be a string' 
      });
      return;
    }
    
    console.log('🧠 Starting thought cycle...');
    
    // Create thought cycle context
    const ctx = {
      originalMessage,
      previousMessages: Array.isArray(previousMessages) ? previousMessages : [],
      executedActions: Array.isArray(executedActions) ? executedActions : []
    };
    
    const result = await thoughtCycleService.startCycle(ctx);
    console.log('✅ Thought cycle completed');
    
    const response: ApiResponse = {
      message: 'Thought cycle executed successfully',
      data: {
        result,
        context: {
          originalMessage: ctx.originalMessage,
          totalPreviousMessages: ctx.previousMessages.length,
          totalExecutedActions: ctx.executedActions.length
        }
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Thought cycle endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to execute thought cycle',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

/**
 * CLI function to test the thought cycle with initial context
 */
async function runCLI() {
  console.log('🧠 SymbIA CLI - Starting Thought Cycle Test');
  console.log('=' .repeat(50));
  
  const ctx = {
    originalMessage: "Help me summarize my notes",
    previousMessages: ["Hi", "What can I help you with?"],
    executedActions: []
  };
  
  try {
    console.log('📝 Initial Context:');
    console.log(`   Original Message: "${ctx.originalMessage}"`);
    console.log(`   Previous Messages: [${ctx.previousMessages.map(m => `"${m}"`).join(', ')}]`);
    console.log(`   Executed Actions: ${ctx.executedActions.length}`);
    console.log('');
    
    const result = await thoughtCycleService.startCycle(ctx);
    
    console.log('');
    console.log('🎯 Final Output:');
    console.log(result);
    console.log('');
    console.log('📊 Final Context State:');
    console.log(`   Total Executed Actions: ${ctx.executedActions.length}`);
    console.log('=' .repeat(50));
    
  } catch (error) {
    console.error('❌ CLI Error:', error);
  }
}

// Check if this is being run directly (CLI mode) or as a module (server mode)
const isDirectRun = require.main === module;

if (isDirectRun) {
  // Check for CLI flag
  const args = process.argv.slice(2);
  if (args.includes('--cli') || args.includes('-c')) {
    runCLI().then(() => {
      console.log('CLI execution completed');
      process.exit(0);
    }).catch((error) => {
      console.error('CLI execution failed:', error);
      process.exit(1);
    });
  } else {
    // Start the server normally
    startServer();
  }
} else {
  // When imported as a module, just export the app
  startServer();
}

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`�️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`�📝 API endpoints:`);
    console.log(`   GET  /`);
    console.log(`   GET  /api/health`);
    console.log(`   POST /api/auth/register`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/chat/stream`);
    console.log(`   GET  /api/models`);
    console.log(`   POST /api/thought/cycle`);
    console.log('');
    console.log('💡 To run CLI mode: npm run dev -- --cli');
  });
}

export default app;
