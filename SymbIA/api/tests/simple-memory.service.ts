import { injectable } from 'tsyringe';
import type { Memory } from '@symbia/interfaces';

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

// Test version without @injectable decorator
export class SimpleMemoryService {
    // In-memory storage for testing/development
    private memories: Map<string, Memory> = new Map();

    async createMemory(userId: string, name: string): Promise<Memory> {
        if (!userId?.trim()) {
            throw new MemoryValidationError('User ID is required');
        }

        if (!name?.trim()) {
            throw new MemoryValidationError('Memory name is required');
        }

        const memory: Memory = {
            id: `mem_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            userId,
            name: name.trim(),
            createdAt: new Date(),
        };

        this.memories.set(memory.id, memory);
        return memory;
    }

    async getMemoriesByUser(userId: string): Promise<Memory[]> {
        if (!userId?.trim()) {
            throw new MemoryValidationError('User ID is required');
        }

        const userMemories = Array.from(this.memories.values())
            .filter(memory => memory.userId === userId && !memory.deletedAt)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return userMemories;
    }

    async getMemoryById(id: string): Promise<Memory | null> {
        if (!id?.trim()) {
            throw new MemoryValidationError('Memory ID is required');
        }

        const memory = this.memories.get(id);
        if (!memory || memory.deletedAt) {
            return null;
        }

        return memory;
    }

    async updateMemory(id: string, name: string): Promise<Memory | null> {
        if (!id?.trim()) {
            throw new MemoryValidationError('Memory ID is required');
        }

        if (!name?.trim()) {
            throw new MemoryValidationError('Memory name is required');
        }

        const memory = this.memories.get(id);
        if (!memory || memory.deletedAt) {
            throw new MemoryNotFoundError('Memory not found');
        }

        const updatedMemory: Memory = {
            ...memory,
            name: name.trim(),
        };

        this.memories.set(id, updatedMemory);
        return updatedMemory;
    }

    async deleteMemory(id: string): Promise<boolean> {
        if (!id?.trim()) {
            throw new MemoryValidationError('Memory ID is required');
        }

        const memory = this.memories.get(id);
        if (!memory || memory.deletedAt) {
            throw new MemoryNotFoundError('Memory not found');
        }

        // Check if this is the last active memory for the user
        const userActiveMemories = await this.getMemoriesByUser(memory.userId);
        if (userActiveMemories.length <= 1) {
            throw new CannotDeleteLastMemoryError('Cannot delete the last memory. Users must have at least one active memory.');
        }

        // Soft delete
        const deletedMemory: Memory = {
            ...memory,
            deletedAt: new Date(),
        };

        this.memories.set(id, deletedMemory);
        return true;
    }

    // Helper method to count active memories for a user
    async countActiveMemoriesForUser(userId: string): Promise<number> {
        const userMemories = await this.getMemoriesByUser(userId);
        return userMemories.length;
    }

    // Helper method for testing - clear all memories
    async clearAll(): Promise<void> {
        this.memories.clear();
    }
}
