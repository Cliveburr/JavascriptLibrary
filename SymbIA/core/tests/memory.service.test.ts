import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryService, MemoryValidationError, MemoryNotFoundError, CannotDeleteLastMemoryError } from '../src/memory/memory.service.js';

describe('MemoryService', () => {
    let memoryService: MemoryService;

    beforeEach(() => {
        memoryService = new MemoryService();
    });

    describe('createMemory', () => {
        it('should create a memory successfully', async () => {
            const memory = await memoryService.createMemory('user1', 'Test Memory');

            expect(memory).toMatchObject({
                userId: 'user1',
                name: 'Test Memory',
            });
            expect(memory.id).toBeDefined();
            expect(memory.createdAt).toBeInstanceOf(Date);
            expect(memory.deletedAt).toBeUndefined();
        });

        it('should trim memory name', async () => {
            const memory = await memoryService.createMemory('user1', '  Test Memory  ');

            expect(memory.name).toBe('Test Memory');
        });

        it('should throw error for empty userId', async () => {
            await expect(memoryService.createMemory('', 'Test Memory'))
                .rejects.toThrow(MemoryValidationError);
        });

        it('should throw error for empty name', async () => {
            await expect(memoryService.createMemory('user1', ''))
                .rejects.toThrow(MemoryValidationError);
        });

        it('should throw error for whitespace-only name', async () => {
            await expect(memoryService.createMemory('user1', '   '))
                .rejects.toThrow(MemoryValidationError);
        });
    });

    describe('getMemoriesByUser', () => {
        it('should return empty array for user with no memories', async () => {
            const memories = await memoryService.getMemoriesByUser('user1');

            expect(memories).toEqual([]);
        });

        it('should return user memories sorted by creation date (newest first)', async () => {
            await memoryService.createMemory('user1', 'Memory 1');
            await new Promise(resolve => setTimeout(resolve, 10)); // Ensure different timestamps
            await memoryService.createMemory('user1', 'Memory 2');
            await memoryService.createMemory('user2', 'Other User Memory');

            const memories = await memoryService.getMemoriesByUser('user1');

            expect(memories).toHaveLength(2);
            expect(memories[0].name).toBe('Memory 2'); // Newest first
            expect(memories[1].name).toBe('Memory 1');
        });

        it('should not return deleted memories', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user1', 'Memory 2');

            // Manually mark as deleted for testing
            await memoryService.deleteMemory(memory1.id);

            const memories = await memoryService.getMemoriesByUser('user1');

            expect(memories).toHaveLength(1);
            expect(memories[0].name).toBe('Memory 2');
        });

        it('should throw error for empty userId', async () => {
            await expect(memoryService.getMemoriesByUser(''))
                .rejects.toThrow(MemoryValidationError);
        });
    });

    describe('getMemoryById', () => {
        it('should return memory by id', async () => {
            const created = await memoryService.createMemory('user1', 'Test Memory');
            const found = await memoryService.getMemoryById(created.id);

            expect(found).toEqual(created);
        });

        it('should return null for non-existent memory', async () => {
            const found = await memoryService.getMemoryById('non-existent');

            expect(found).toBeNull();
        });

        it('should return null for deleted memory', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user1', 'Memory 2'); // Need at least 2 to delete one
            await memoryService.deleteMemory(memory1.id);

            const found = await memoryService.getMemoryById(memory1.id);

            expect(found).toBeNull();
        });

        it('should throw error for empty id', async () => {
            await expect(memoryService.getMemoryById(''))
                .rejects.toThrow(MemoryValidationError);
        });
    });

    describe('updateMemory', () => {
        it('should update memory name', async () => {
            const created = await memoryService.createMemory('user1', 'Original Name');
            const updated = await memoryService.updateMemory(created.id, 'Updated Name');

            expect(updated).toMatchObject({
                ...created,
                name: 'Updated Name',
            });
        });

        it('should trim updated name', async () => {
            const created = await memoryService.createMemory('user1', 'Original Name');
            const updated = await memoryService.updateMemory(created.id, '  Updated Name  ');

            expect(updated?.name).toBe('Updated Name');
        });

        it('should throw error for non-existent memory', async () => {
            await expect(memoryService.updateMemory('non-existent', 'New Name'))
                .rejects.toThrow(MemoryNotFoundError);
        });

        it('should throw error for deleted memory', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user1', 'Memory 2'); // Need at least 2 to delete one
            await memoryService.deleteMemory(memory1.id);

            await expect(memoryService.updateMemory(memory1.id, 'New Name'))
                .rejects.toThrow(MemoryNotFoundError);
        });

        it('should throw error for empty id', async () => {
            await expect(memoryService.updateMemory('', 'New Name'))
                .rejects.toThrow(MemoryValidationError);
        });

        it('should throw error for empty name', async () => {
            const created = await memoryService.createMemory('user1', 'Original Name');

            await expect(memoryService.updateMemory(created.id, ''))
                .rejects.toThrow(MemoryValidationError);
        });
    });

    describe('deleteMemory', () => {
        it('should soft delete memory when user has multiple memories', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            const memory2 = await memoryService.createMemory('user1', 'Memory 2');

            const result = await memoryService.deleteMemory(memory1.id);

            expect(result).toBe(true);

            const memories = await memoryService.getMemoriesByUser('user1');
            expect(memories).toHaveLength(1);
            expect(memories[0].id).toBe(memory2.id);
        });

        it('should throw error when trying to delete last memory', async () => {
            const memory = await memoryService.createMemory('user1', 'Only Memory');

            await expect(memoryService.deleteMemory(memory.id))
                .rejects.toThrow(CannotDeleteLastMemoryError);
        });

        it('should throw error for non-existent memory', async () => {
            await expect(memoryService.deleteMemory('non-existent'))
                .rejects.toThrow(MemoryNotFoundError);
        });

        it('should throw error for already deleted memory', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            const memory2 = await memoryService.createMemory('user1', 'Memory 2');
            await memoryService.deleteMemory(memory1.id);

            await expect(memoryService.deleteMemory(memory1.id))
                .rejects.toThrow(MemoryNotFoundError);
        });

        it('should throw error for empty id', async () => {
            await expect(memoryService.deleteMemory(''))
                .rejects.toThrow(MemoryValidationError);
        });
    });

    describe('countActiveMemoriesForUser', () => {
        it('should count active memories correctly', async () => {
            await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user1', 'Memory 2');
            await memoryService.createMemory('user2', 'Other User Memory');

            const count = await memoryService.countActiveMemoriesForUser('user1');

            expect(count).toBe(2);
        });

        it('should not count deleted memories', async () => {
            const memory1 = await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user1', 'Memory 2');
            await memoryService.deleteMemory(memory1.id);

            const count = await memoryService.countActiveMemoriesForUser('user1');

            expect(count).toBe(1);
        });

        it('should return 0 for user with no memories', async () => {
            const count = await memoryService.countActiveMemoriesForUser('user1');

            expect(count).toBe(0);
        });
    });

    describe('clearAll', () => {
        it('should clear all memories', async () => {
            await memoryService.createMemory('user1', 'Memory 1');
            await memoryService.createMemory('user2', 'Memory 2');

            await memoryService.clearAll();

            const user1Memories = await memoryService.getMemoriesByUser('user1');
            const user2Memories = await memoryService.getMemoriesByUser('user2');

            expect(user1Memories).toHaveLength(0);
            expect(user2Memories).toHaveLength(0);
        });
    });
});
