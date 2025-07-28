import { Types } from 'mongoose';
import { Memory } from '../models/memory.model';
import { IMemory } from '../interfaces/memory.interface';

export class MemoryService {
  async createMemory(name: string, userId: string): Promise<IMemory> {
    const memoryId = new Types.ObjectId();
    const qdrantCollectionName = `${userId}_${memoryId.toString()}`;
    
    const memory = new Memory({
      name,
      userId: new Types.ObjectId(userId),
      qdrantCollectionName,
    });

    await memory.save();
    return memory;
  }

  async createDefaultMemory(userId: string): Promise<IMemory> {
    const memoryId = new Types.ObjectId();
    const qdrantCollectionName = `${userId}_${memoryId.toString()}`;
    
    const memory = new Memory({
      name: 'Memória Padrão',
      userId: new Types.ObjectId(userId),
      qdrantCollectionName,
      isDefault: true,
    });

    await memory.save();
    return memory;
  }

  async getMemoriesByUserId(userId: string): Promise<IMemory[]> {
    const memories = await Memory.find({ userId: new Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: 1 });
    return memories;
  }

  async deleteMemory(memoryId: string, userId: string): Promise<boolean> {
    const memory = await Memory.findOne({ 
      _id: new Types.ObjectId(memoryId), 
      userId: new Types.ObjectId(userId) 
    });
    
    if (!memory) {
      return false;
    }

    if (memory.isDefault) {
      throw new Error('Não é possível excluir a memória padrão');
    }

    await Memory.deleteOne({ _id: new Types.ObjectId(memoryId) });
    return true;
  }

  async getMemoryById(memoryId: string, userId: string): Promise<IMemory | null> {
    const memory = await Memory.findOne({ 
      _id: new Types.ObjectId(memoryId), 
      userId: new Types.ObjectId(userId) 
    });
    return memory;
  }
}
