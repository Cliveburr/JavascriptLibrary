import { describe, it, expect } from 'vitest';
import type { User, Memory, Chat, Message } from '../src/domain.js';

describe('Domain types', () => {
  it('should have correct User interface structure', () => {
    const user: User = {
      id: '1',
      email: 'test@example.com',
      passwordHash: 'hash123',
      defaultMemoryId: 'mem1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(user.id).toBe('1');
    expect(user.email).toBe('test@example.com');
  });

  it('should have correct Memory interface structure', () => {
    const memory: Memory = {
      id: 'mem1',
      userId: '1',
      name: 'Test Memory',
      createdAt: new Date(),
    };

    expect(memory.id).toBe('mem1');
    expect(memory.name).toBe('Test Memory');
  });
});
