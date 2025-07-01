import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { LLMManager } from './services/llm.service';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3002', 10);
const llmManager = new LLMManager();

// Middlewares de segurança e logging
app.use(helmet());
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Interface para respostas padronizadas
interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  status?: string;
  version?: string;
  timestamp?: string;
  uptime?: number;
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
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

// Chat streaming endpoint
app.post('/api/chat/stream', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, model = 'llama3.2:latest' } = req.body;
    
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET  /`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/data`);
  console.log(`   POST /api/data`);
});

export default app;
