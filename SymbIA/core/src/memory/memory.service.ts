import type { Memory } from '../types/domain.js';
import { MongoDBService } from '../database/mongodb.service.js';
import { ObjectId } from 'mongodb';
import { v6 } from 'uuid';

export class MemoryValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MemoryValidationError';
  }
}

export class MemoryNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MemoryNotFoundError';
  }
}

export class CannotDeleteLastMemoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CannotDeleteLastMemoryError';
  }
}

export class MemoryService {

  constructor(
    private mongodbService: MongoDBService
  ) {
    // Ensure MongoDB connection
    this.mongodbService.connect().catch(console.error);
  }

  async createMemory(userId: string, name: string): Promise<Memory> {
    if (!userId?.trim()) {
      throw new MemoryValidationError('User ID is required');
    }

    if (!name?.trim()) {
      throw new MemoryValidationError('Memory name is required');
    }

    const memory: Memory = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
      name: name.trim(),
      vectorDatabase: `${userId}_${v6(undefined, undefined, Date.now())}`,
      totalChatCreated: 0,
      createdAt: new Date(),
    };

    const collection = this.mongodbService.getMemoriesCollection();
    await collection.insertOne(memory);

    return memory;
  }

  async getMemoriesByUser(userId: string): Promise<Memory[]> {
    if (!userId?.trim()) {
      throw new MemoryValidationError('User ID is required');
    }

    const collection = this.mongodbService.getMemoriesCollection();
    const userMemories = await collection.find({
      userId: new ObjectId(userId),
      deletedAt: { $exists: false }
    }).sort({ createdAt: -1 }).toArray();

    return userMemories;
  }

  async getMemoryById(id: string): Promise<Memory | null> {
    if (!id?.trim()) {
      throw new MemoryValidationError('Memory ID is required');
    }

    const collection = this.mongodbService.getMemoriesCollection();
    const memory = await collection.findOne({
      _id: new ObjectId(id),
      deletedAt: { $exists: false }
    });

    return memory;
  }

  async updateMemory(id: string, name: string): Promise<Memory | null> {
    if (!id?.trim()) {
      throw new MemoryValidationError('Memory ID is required');
    }

    if (!name?.trim()) {
      throw new MemoryValidationError('Memory name is required');
    }

    const collection = this.mongodbService.getMemoriesCollection();
    const memory = await collection.findOne({
      _id: new ObjectId(id),
      deletedAt: { $exists: false }
    });

    if (!memory) {
      throw new MemoryNotFoundError('Memory not found');
    }

    const updatedMemory: Memory = {
      ...memory,
      name: name.trim(),
    };

    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: name.trim() } }
    );

    return updatedMemory;
  }

  async deleteMemory(id: string): Promise<boolean> {
    if (!id?.trim()) {
      throw new MemoryValidationError('Memory ID is required');
    }

    const collection = this.mongodbService.getMemoriesCollection();
    const memory = await collection.findOne({
      _id: new ObjectId(id),
      deletedAt: { $exists: false }
    });

    if (!memory) {
      throw new MemoryNotFoundError('Memory not found');
    }

    // Check if this is the last active memory for the user
    const userActiveMemories = await this.getMemoriesByUser(memory.userId.toString());
    if (userActiveMemories.length <= 1) {
      throw new CannotDeleteLastMemoryError('Cannot delete the last memory. Users must have at least one active memory.');
    }

    // Soft delete
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { deletedAt: new Date() } }
    );

    return true;
  }

  // Helper method to count active memories for a user
  async countActiveMemoriesForUser(userId: string): Promise<number> {
    const userMemories = await this.getMemoriesByUser(userId);
    return userMemories.length;
  }

  // Helper method for testing - clear all memories
  async clearAll(): Promise<void> {
    const collection = this.mongodbService.getMemoriesCollection();
    await collection.deleteMany({});
  }
}
