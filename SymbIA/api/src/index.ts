import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { LLMManager } from './services/llm.service';
import { MessageDecomposer } from './services/message-decomposer.service';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3002', 10);
const llmManager = new LLMManager();
const messageDecomposer = new MessageDecomposer(llmManager);

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
    timestamp: new Date().toISOString()
  };
  res.json(response);
});

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

// Endpoint para decomposição de mensagens
app.post('/api/decompose', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
      return;
    }
    
    const decomposition = await messageDecomposer.decomposeMessage(message);
    
    const response: ApiResponse = {
      message: 'Message decomposed successfully',
      data: decomposition,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Decompose endpoint error:', error);
    res.status(500).json({ error: 'Failed to decompose message' });
  }
});

// Endpoint para decomposição enriquecida com embeddings e contexto vetorial
app.post('/api/decompose/enriched', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
      return;
    }
    
    console.log('🚀 Starting enriched decomposition pipeline...');
    const enrichedDecomposition = await messageDecomposer.decomposeAndEnrichMessage(message);
    
    const response: ApiResponse = {
      message: 'Message decomposed and enriched successfully',
      data: enrichedDecomposition,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Enriched decompose endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to decompose and enrich message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint para decomposição, enriquecimento e criação de plano de execução
app.post('/api/decompose/plan', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        error: 'Message is required and must be a string' 
      });
      return;
    }
    
    console.log('🚀 Starting full pipeline with execution planning...');
    const result = await messageDecomposer.decomposeEnrichAndPlan(message);
    
    const response: ApiResponse = {
      message: 'Message processed and execution plan created successfully',
      data: {
        enrichedDecomposition: result.enrichedDecomposition,
        executionPlan: result.executionPlan
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Execution planning endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to create execution plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint para buscar contexto de um texto específico
app.post('/api/context/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, limit = 5 } = req.body;
    
    if (!text || typeof text !== 'string') {
      res.status(400).json({ 
        error: 'Text is required and must be a string' 
      });
      return;
    }
    
    const contextSources = await messageDecomposer.searchContextForText(text, limit);
    
    const response: ApiResponse = {
      message: 'Context search completed successfully',
      data: {
        query: text,
        limit: limit,
        results: contextSources,
        count: contextSources.length
      },
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Context search endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to search context',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
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

// Endpoint para obter estatísticas do cache
app.get('/api/cache/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheStats = messageDecomposer.getCacheStats();
    
    const response: ApiResponse = {
      message: 'Cache statistics retrieved successfully',
      data: cacheStats,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Cache stats endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to get cache statistics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint para limpar o cache
app.post('/api/cache/clear', async (req: Request, res: Response): Promise<void> => {
  try {
    messageDecomposer.clearCache();
    
    const response: ApiResponse = {
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Cache clear endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to clear cache',
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   GET  /`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/data`);
  console.log(`   POST /api/data`);
  console.log(`   POST /api/decompose`);
  console.log(`   POST /api/decompose/enriched`);
  console.log(`   POST /api/decompose/plan`);
  console.log(`   POST /api/context/search`);
  console.log(`   GET  /api/models`);
  console.log(`   GET  /api/cache/stats`);
  console.log(`   POST /api/cache/clear`);
});

export default app;
