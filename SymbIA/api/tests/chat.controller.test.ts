import 'reflect-metadata';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../src/controllers/chat.controller.js';
import { ThoughtCycleService } from '@symbia/core';
import type { SendMessageResponse } from '@symbia/interfaces';

// Mock auth middleware for testing
const mockAuthMiddleware = (req: any, res: any, next: any) => {
    req.user = { id: 'test-user-1' };
    next();
};

describe('ChatController Integration', () => {
    let app: express.Application;
    let thoughtCycleService: ThoughtCycleService;
    const mockMemoryId = '550e8400-e29b-41d4-a716-446655440000';

    beforeEach(() => {
        // Clear container and create fresh instances
        container.clearInstances();

        // Create a mock thought cycle service
        thoughtCycleService = {
            handle: vi.fn().mockResolvedValue('Esta é uma resposta mock do assistente.')
        } as any;

        container.registerInstance(ThoughtCycleService, thoughtCycleService);

        const controller = container.resolve(ChatController);

        app = express();
        app.use(express.json());
        app.use(mockAuthMiddleware);

        // Setup routes
        app.post('/chats/:memoryId/messages', (req, res) => {
            controller.sendMessage(req, res);
        });
    });

    describe('POST /chats/:memoryId/messages', () => {
        it('should send a message and receive a response', async () => {
            const messageContent = 'Olá, como você está?';

            const response = await request(app)
                .post(`/chats/${mockMemoryId}/messages`)
                .send({ content: messageContent })
                .expect(200);

            const body = response.body as SendMessageResponse;

            expect(body.message).toBeDefined();
            expect(body.message.role).toBe('assistant');
            expect(body.message.content).toBe('Esta é uma resposta mock do assistente.');
            expect(body.message.contentType).toBe('text');
            expect(body.message.chatId).toBe(`chat-${mockMemoryId}`);
            expect(body.message.createdAt).toBeDefined();
            expect(body.message.id).toBeDefined();
        });

        it('should include response time in headers', async () => {
            const response = await request(app)
                .post(`/chats/${mockMemoryId}/messages`)
                .send({ content: 'Test message' })
                .expect(200);

            expect(response.headers['x-response-time']).toBeDefined();
            expect(response.headers['x-response-time']).toMatch(/\d+ms/);
        });

        it('should reject empty message content', async () => {
            const response = await request(app)
                .post(`/chats/${mockMemoryId}/messages`)
                .send({ content: '' })
                .expect(400);

            expect(response.body.error).toBe('Invalid request body');
            expect(response.body.details).toBeDefined();
        });

        it('should reject invalid memory ID format', async () => {
            const response = await request(app)
                .post('/chats/invalid-uuid/messages')
                .send({ content: 'Test message' })
                .expect(400);

            expect(response.body.error).toBe('Invalid parameters');
            expect(response.body.details).toBeDefined();
        });

        it('should simulate a short conversation', async () => {
            const messages = [
                'Olá, qual é o meu nome?',
                'Você pode me lembrar de algo?',
                'Obrigado pela ajuda!'
            ];

            for (const message of messages) {
                const response = await request(app)
                    .post(`/chats/${mockMemoryId}/messages`)
                    .send({ content: message })
                    .expect(200);

                const body = response.body as SendMessageResponse;
                expect(body.message.role).toBe('assistant');
                expect(body.message.content).toBeDefined();
                expect(body.message.content.length).toBeGreaterThan(0);
            }
        });

        it('should have latency under 800ms with mock LLM', async () => {
            const startTime = Date.now();

            const response = await request(app)
                .post(`/chats/${mockMemoryId}/messages`)
                .send({ content: 'Test latency' })
                .expect(200);

            const endTime = Date.now();
            const actualLatency = endTime - startTime;

            expect(actualLatency).toBeLessThan(800);

            // Também verificar o header de resposta
            const headerLatency = parseInt(response.headers['x-response-time'].replace('ms', ''));
            expect(headerLatency).toBeLessThan(800);
        });
    });
});
