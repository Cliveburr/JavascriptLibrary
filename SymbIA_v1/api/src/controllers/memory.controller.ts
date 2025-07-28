import { Request, Response } from 'express';
import { MemoryService } from '../services/memory.service';

export class MemoryController {
  private memoryService = new MemoryService();

  createMemory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const userId = (req as any).user.id;

      if (!name || name.trim() === '') {
        res.status(400).json({ error: 'Nome da memória é obrigatório' });
        return;
      }

      const memory = await this.memoryService.createMemory(name.trim(), userId);
      res.status(201).json(memory);
    } catch (error) {
      console.error('Error creating memory:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  getMemories = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const memories = await this.memoryService.getMemoriesByUserId(userId);
      res.json(memories);
    } catch (error) {
      console.error('Error getting memories:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  deleteMemory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const deleted = await this.memoryService.deleteMemory(id, userId);
      if (!deleted) {
        res.status(404).json({ error: 'Memória não encontrada' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting memory:', error);
      if (error.message === 'Não é possível excluir a memória padrão') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };

  getMemory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;

      const memory = await this.memoryService.getMemoryById(id, userId);
      if (!memory) {
        res.status(404).json({ error: 'Memória não encontrada' });
        return;
      }

      res.json(memory);
    } catch (error) {
      console.error('Error getting memory:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  };
}
