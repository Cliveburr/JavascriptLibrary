import { describe, it, expect } from 'vitest';
import type {
    LoginRequest,
    LoginResponse,
    MemoryDTO,
    CreateMemoryRequest,
    UpdateMemoryRequest,
    ChatDTO,
    CreateChatRequest,
    MessageDTO,
    SendMessageRequest,
    SendMessageResponse,
} from '../src/api.js';

describe('API types', () => {
    it('should have correct LoginRequest interface structure', () => {
        const request: LoginRequest = {
            email: 'test@example.com',
            password: 'password123',
        };

        expect(request.email).toBe('test@example.com');
        expect(request.password).toBe('password123');
    });

    it('should have correct LoginResponse interface structure', () => {
        const response: LoginResponse = {
            token: 'jwt-token-here',
            refreshToken: 'refresh-token-here',
            user: {
                id: 'user1',
                email: 'test@example.com',
                defaultMemoryId: 'mem1',
            },
        };

        expect(response.token).toBe('jwt-token-here');
        expect(response.refreshToken).toBe('refresh-token-here');
        expect(response.user.id).toBe('user1');
        expect(response.user.email).toBe('test@example.com');
        expect(response.user.defaultMemoryId).toBe('mem1');
    });

    it('should have correct MemoryDTO interface structure', () => {
        const memory: MemoryDTO = {
            id: 'mem1',
            userId: 'user1',
            name: 'Test Memory',
            createdAt: '2023-07-28T10:00:00.000Z',
        };

        expect(memory.id).toBe('mem1');
        expect(memory.userId).toBe('user1');
        expect(memory.name).toBe('Test Memory');
        expect(memory.createdAt).toBe('2023-07-28T10:00:00.000Z');
        expect(memory.deletedAt).toBeUndefined();
    });

    it('should have correct MemoryDTO interface structure with deletedAt', () => {
        const memory: MemoryDTO = {
            id: 'mem1',
            userId: 'user1',
            name: 'Test Memory',
            createdAt: '2023-07-28T10:00:00.000Z',
            deletedAt: '2023-07-28T11:00:00.000Z',
        };

        expect(memory.deletedAt).toBe('2023-07-28T11:00:00.000Z');
    });

    it('should have correct CreateMemoryRequest interface structure', () => {
        const request: CreateMemoryRequest = {
            name: 'New Memory',
        };

        expect(request.name).toBe('New Memory');
    });

    it('should have correct UpdateMemoryRequest interface structure', () => {
        const request: UpdateMemoryRequest = {
            name: 'Updated Memory',
        };

        expect(request.name).toBe('Updated Memory');
    });

    it('should have correct ChatDTO interface structure', () => {
        const chat: ChatDTO = {
            id: 'chat1',
            memoryId: 'mem1',
            title: 'Test Chat',
            createdAt: '2023-07-28T10:00:00.000Z',
        };

        expect(chat.id).toBe('chat1');
        expect(chat.memoryId).toBe('mem1');
        expect(chat.title).toBe('Test Chat');
        expect(chat.createdAt).toBe('2023-07-28T10:00:00.000Z');
    });

    it('should have correct CreateChatRequest interface structure', () => {
        const request: CreateChatRequest = {
            memoryId: 'mem1',
            title: 'New Chat',
        };

        expect(request.memoryId).toBe('mem1');
        expect(request.title).toBe('New Chat');
    });

    it('should have correct CreateChatRequest interface structure without title', () => {
        const request: CreateChatRequest = {
            memoryId: 'mem1',
        };

        expect(request.memoryId).toBe('mem1');
        expect(request.title).toBeUndefined();
    });

    it('should have correct MessageDTO interface structure', () => {
        const message: MessageDTO = {
            id: 'msg1',
            chatId: 'chat1',
            role: 'user',
            content: 'Hello world',
            contentType: 'text',
            createdAt: '2023-07-28T10:00:00.000Z',
        };

        expect(message.id).toBe('msg1');
        expect(message.chatId).toBe('chat1');
        expect(message.role).toBe('user');
        expect(message.content).toBe('Hello world');
        expect(message.contentType).toBe('text');
        expect(message.createdAt).toBe('2023-07-28T10:00:00.000Z');
        expect(message.toolCall).toBeUndefined();
    });

    it('should have correct MessageDTO interface structure with toolCall', () => {
        const message: MessageDTO = {
            id: 'msg1',
            chatId: 'chat1',
            role: 'assistant',
            content: 'Using tool...',
            contentType: 'text',
            toolCall: { function: 'searchMemory', args: { query: 'test' } },
            createdAt: '2023-07-28T10:00:00.000Z',
        };

        expect(message.toolCall).toEqual({ function: 'searchMemory', args: { query: 'test' } });
    });

    it('should have correct SendMessageRequest interface structure', () => {
        const request: SendMessageRequest = {
            chatId: 'chat1',
            content: 'Hello world',
            contentType: 'text',
        };

        expect(request.chatId).toBe('chat1');
        expect(request.content).toBe('Hello world');
        expect(request.contentType).toBe('text');
    });

    it('should have correct SendMessageRequest interface structure without contentType', () => {
        const request: SendMessageRequest = {
            chatId: 'chat1',
            content: 'Hello world',
        };

        expect(request.chatId).toBe('chat1');
        expect(request.content).toBe('Hello world');
        expect(request.contentType).toBeUndefined();
    });

    it('should have correct SendMessageResponse interface structure', () => {
        const response: SendMessageResponse = {
            message: {
                id: 'msg1',
                chatId: 'chat1',
                role: 'user',
                content: 'Hello world',
                contentType: 'text',
                createdAt: '2023-07-28T10:00:00.000Z',
            },
        };

        expect(response.message.id).toBe('msg1');
        expect(response.message.chatId).toBe('chat1');
        expect(response.message.role).toBe('user');
        expect(response.message.content).toBe('Hello world');
        expect(response.message.contentType).toBe('text');
        expect(response.message.createdAt).toBe('2023-07-28T10:00:00.000Z');
    });
});
