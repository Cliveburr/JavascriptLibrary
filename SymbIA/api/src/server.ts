import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Placeholder routes
app.get('/api/memories', (_req: Request, res: Response) => {
  res.json({ memories: [] });
});

app.get('/api/chats', (_req: Request, res: Response) => {
  res.json({ chats: [] });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
