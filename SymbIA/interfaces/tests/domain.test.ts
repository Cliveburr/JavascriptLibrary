import { describe, it, expect } from 'vitest';
import type {
  User,
  Memory,
  Chat,
  Message,
  MessageRole,
  ContentType,
  VectorEntry
} from '../src/domain.js';

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
    expect(user.defaultMemoryId).toBe('mem1');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
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
    expect(memory.userId).toBe('1');
    expect(memory.createdAt).toBeInstanceOf(Date);
    expect(memory.deletedAt).toBeUndefined();
  });

  it('should have correct Chat interface structure', () => {
    const chat: Chat = {
      id: 'chat1',
      memoryId: 'mem1',
      title: 'Test Chat',
      createdAt: new Date(),
    };

    expect(chat.id).toBe('chat1');
    expect(chat.memoryId).toBe('mem1');
    expect(chat.title).toBe('Test Chat');
    expect(chat.createdAt).toBeInstanceOf(Date);
  });

  it('should have correct Message interface structure', () => {
    const message: Message = {
      id: 'msg1',
      chatId: 'chat1',
      role: 'user',
      content: 'Hello world',
      contentType: 'text',
      createdAt: new Date(),
    };

    expect(message.id).toBe('msg1');
    expect(message.chatId).toBe('chat1');
    expect(message.role).toBe('user');
    expect(message.content).toBe('Hello world');
    expect(message.contentType).toBe('text');
    expect(message.createdAt).toBeInstanceOf(Date);
    expect(message.toolCall).toBeUndefined();
  });

  it('should have correct MessageRole type', () => {
    const userRole: MessageRole = 'user';
    const assistantRole: MessageRole = 'assistant';
    const systemRole: MessageRole = 'system';

    expect(userRole).toBe('user');
    expect(assistantRole).toBe('assistant');
    expect(systemRole).toBe('system');
  });

  it('should have correct ContentType type', () => {
    const textType: ContentType = 'text';
    const formType: ContentType = 'form';
    const chartType: ContentType = 'chart';
    const fileType: ContentType = 'file';

    expect(textType).toBe('text');
    expect(formType).toBe('form');
    expect(chartType).toBe('chart');
    expect(fileType).toBe('file');
  });

  it('should have correct VectorEntry interface structure', () => {
    const vectorEntry: VectorEntry = {
      id: 'vec1',
      memoryId: 'mem1',
      embedding: [0.1, 0.2, 0.3],
      payload: {
        type: 'conversation',
        tags: ['important', 'topic1'],
        timestamp: new Date(),
      },
    };

    expect(vectorEntry.id).toBe('vec1');
    expect(vectorEntry.memoryId).toBe('mem1');
    expect(vectorEntry.embedding).toHaveLength(3);
    expect(vectorEntry.payload.type).toBe('conversation');
    expect(vectorEntry.payload.tags).toHaveLength(2);
    expect(vectorEntry.payload.timestamp).toBeInstanceOf(Date);
  });
});
