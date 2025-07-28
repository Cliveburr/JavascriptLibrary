import { injectable } from 'tsyringe';
import type { Memory } from '@symbia/interfaces';

@injectable()
export class MemoryService {
  async createMemory(userId: string, name: string): Promise<Memory> {
    // TODO: Implement database logic
    return {
      id: `mem_${Date.now()}`,
      userId,
      name,
      createdAt: new Date(),
    };
  }

  async getMemoriesByUser(_userId: string): Promise<Memory[]> {
    // TODO: Implement database logic
    return [];
  }

  async getMemoryById(_id: string): Promise<Memory | null> {
    // TODO: Implement database logic
    return null;
  }

  async updateMemory(_id: string, _name: string): Promise<Memory | null> {
    // TODO: Implement database logic
    return null;
  }

  async deleteMemory(_id: string): Promise<boolean> {
    // TODO: Implement soft delete logic
    return false;
  }
}
