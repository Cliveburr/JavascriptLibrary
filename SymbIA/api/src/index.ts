import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '3002', 10);

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

// Interface para itens de dados
interface DataItem {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
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

// Exemplo de rota para dados
app.get('/api/data', (req: Request, res: Response): void => {
  const sampleData: DataItem[] = [
    { id: 1, name: 'Item 1', description: 'First item' },
    { id: 2, name: 'Item 2', description: 'Second item' },
    { id: 3, name: 'Item 3', description: 'Third item' }
  ];
  
  const response: ApiResponse<DataItem[]> = {
    message: 'Data endpoint',
    data: sampleData
  };
  res.json(response);
});

// Rota para criar novo item
app.post('/api/data', (req: Request, res: Response): void => {
  const { name, description }: { name?: string; description?: string } = req.body;
  
  if (!name || !description) {
    const errorResponse: ApiResponse = {
      error: 'Name and description are required'
    };
    res.status(400).json(errorResponse);
    return;
  }

  // Simulação de criação de item
  const newItem: DataItem = {
    id: Math.floor(Math.random() * 1000),
    name,
    description,
    createdAt: new Date().toISOString()
  };

  const response: ApiResponse<DataItem> = {
    message: 'Item created successfully',
    data: newItem
  };
  res.status(201).json(response);
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
