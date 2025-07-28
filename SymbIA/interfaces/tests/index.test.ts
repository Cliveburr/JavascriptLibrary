import { describe, it, expect } from 'vitest';
import type * as allTypes from '../src/index.js';

describe('Index exports', () => {
    it('should compile with all domain types available', () => {
        // This is a TypeScript compile-time test
        // If the types are properly exported, this code will compile
        const testDomainTypes = (): void => {
            const user: allTypes.User = {
                id: '1',
                email: 'test@example.com',
                passwordHash: 'hash',
                defaultMemoryId: 'mem1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const memory: allTypes.Memory = {
                id: 'mem1',
                userId: '1',
                name: 'Test',
                createdAt: new Date(),
            };

            const chat: allTypes.Chat = {
                id: 'chat1',
                memoryId: 'mem1',
                title: 'Test Chat',
                createdAt: new Date(),
            };

            const message: allTypes.Message = {
                id: 'msg1',
                chatId: 'chat1',
                role: 'user',
                content: 'Hello',
                contentType: 'text',
                createdAt: new Date(),
            };

            const vectorEntry: allTypes.VectorEntry = {
                id: 'vec1',
                memoryId: 'mem1',
                embedding: [0.1, 0.2],
                payload: {
                    type: 'test',
                    tags: ['tag1'],
                    timestamp: new Date(),
                },
            };

            // Use the variables to avoid unused variable warnings
            expect(user.id).toBe('1');
            expect(memory.name).toBe('Test');
            expect(chat.title).toBe('Test Chat');
            expect(message.content).toBe('Hello');
            expect(vectorEntry.embedding).toHaveLength(2);
        };

        expect(testDomainTypes).not.toThrow();
    });

    it('should compile with all LLM types available', () => {
        const testLlmTypes = (): void => {
            const llmSet: allTypes.LlmSet = 'fast-chat';

            const modelSpec: allTypes.ModelSpec = {
                provider: 'openai',
                model: 'gpt-4o',
            };

            const provider: allTypes.LlmProvider = {
                name: 'OpenAI',
                baseUrl: 'https://api.openai.com',
                apiKey: 'sk-test',
            };

            const request: allTypes.LlmRequest = {
                messages: [{ role: 'user', content: 'Hello' }],
                model: 'gpt-4o',
            };

            const response: allTypes.LlmResponse = {
                content: 'Hi there!',
            };

            // Use the variables to avoid unused variable warnings
            expect(llmSet).toBe('fast-chat');
            expect(modelSpec.provider).toBe('openai');
            expect(provider.name).toBe('OpenAI');
            expect(request.model).toBe('gpt-4o');
            expect(response.content).toBe('Hi there!');
        };

        expect(testLlmTypes).not.toThrow();
    });

    it('should compile with all API types available', () => {
        const testApiTypes = (): void => {
            const loginRequest: allTypes.LoginRequest = {
                email: 'test@example.com',
                password: 'password',
            };

            const loginResponse: allTypes.LoginResponse = {
                token: 'jwt-token',
                refreshToken: 'refresh-token',
                user: {
                    id: 'user1',
                    email: 'test@example.com',
                    defaultMemoryId: 'mem1',
                },
            };

            const memoryDto: allTypes.MemoryDTO = {
                id: 'mem1',
                userId: 'user1',
                name: 'Test Memory',
                createdAt: '2023-07-28T10:00:00.000Z',
            };

            const chatDto: allTypes.ChatDTO = {
                id: 'chat1',
                memoryId: 'mem1',
                title: 'Test Chat',
                createdAt: '2023-07-28T10:00:00.000Z',
            };

            const messageDto: allTypes.MessageDTO = {
                id: 'msg1',
                chatId: 'chat1',
                role: 'user',
                content: 'Hello',
                contentType: 'text',
                createdAt: '2023-07-28T10:00:00.000Z',
            };

            const createMemoryRequest: allTypes.CreateMemoryRequest = {
                name: 'New Memory',
            };

            const updateMemoryRequest: allTypes.UpdateMemoryRequest = {
                name: 'Updated Memory',
            };

            const createChatRequest: allTypes.CreateChatRequest = {
                memoryId: 'mem1',
            };

            const sendMessageRequest: allTypes.SendMessageRequest = {
                chatId: 'chat1',
                content: 'Hello world',
            };

            const sendMessageResponse: allTypes.SendMessageResponse = {
                message: messageDto,
            };

            // Use the variables to avoid unused variable warnings
            expect(loginRequest.email).toBe('test@example.com');
            expect(loginResponse.token).toBe('jwt-token');
            expect(memoryDto.name).toBe('Test Memory');
            expect(chatDto.title).toBe('Test Chat');
            expect(messageDto.content).toBe('Hello');
            expect(createMemoryRequest.name).toBe('New Memory');
            expect(updateMemoryRequest.name).toBe('Updated Memory');
            expect(createChatRequest.memoryId).toBe('mem1');
            expect(sendMessageRequest.content).toBe('Hello world');
            expect(sendMessageResponse.message).toBe(messageDto);
        };

        expect(testApiTypes).not.toThrow();
    });

    it('should compile with all type aliases available', () => {
        const testTypeAliases = (): void => {
            const messageRole: allTypes.MessageRole = 'user';
            const contentType: allTypes.ContentType = 'text';

            expect(messageRole).toBe('user');
            expect(contentType).toBe('text');
        };

        expect(testTypeAliases).not.toThrow();
    });
});
