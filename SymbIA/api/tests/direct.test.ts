import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { MemoryService } from '@symbia/core';
import { SimpleMemoryService } from './simple-memory.service.js';

describe('MemoryService Direct Test', () => {
    it('should work with SimpleMemoryService', async () => {
        const service = new SimpleMemoryService();

        console.log('Creating memory...');
        const memory = await service.createMemory('test-user', 'Test Memory');
        console.log('Memory created:', memory.id, memory.userId, memory.name);

        console.log('Getting memories...');
        const memories = await service.getMemoriesByUser('test-user');
        console.log('Memories found:', memories.length);
        console.log('Memories content:', memories);

        expect(memories).toHaveLength(1);
        expect(memories[0].name).toBe('Test Memory');
    });

    it('should work with corrected MemoryService', async () => {
        const service = new MemoryService();

        console.log('Creating memory...');
        const memory = await service.createMemory('test-user', 'Test Memory');
        console.log('Memory created:', memory.id, memory.userId, memory.name);

        console.log('Getting memories...');
        const memories = await service.getMemoriesByUser('test-user');
        console.log('Memories found:', memories.length);

        expect(memories).toHaveLength(1);
        expect(memories[0].name).toBe('Test Memory');
    });
});
