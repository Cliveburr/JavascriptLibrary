import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { ThoughtCycleService } from '../src/thought/thought-cycle.service.js';
import { LlmGateway } from '../src/llm/LlmGateway.js';
import type { LlmResponse } from '@symbia/interfaces';

describe('ThoughtCycleService', () => {
    let thoughtCycleService: ThoughtCycleService;
    let mockLlmGateway: LlmGateway;

    beforeEach(() => {
        // Create a mock LlmGateway
        mockLlmGateway = {
            invoke: vi.fn(),
            getProvider: vi.fn(),
            getModelSpec: vi.fn()
        } as any;

        // Register the mock in the container
        container.registerInstance(LlmGateway, mockLlmGateway);

        // Get the service instance
        thoughtCycleService = container.resolve(ThoughtCycleService);
    });

    it('should return a non-empty string response', async () => {
        // Arrange
        const userId = 'user-123';
        const memoryId = 'memory-456';
        const message = 'Olá, como você está?';

        const mockResponse: LlmResponse = {
            content: 'Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo?',
            usage: {
                promptTokens: 20,
                completionTokens: 15,
                totalTokens: 35
            }
        };

        vi.mocked(mockLlmGateway.invoke).mockResolvedValue(mockResponse);

        // Act
        const result = await thoughtCycleService.handle(userId, memoryId, message);

        // Assert
        expect(result).toBe(mockResponse.content);
        expect(result).not.toBe('');
        expect(typeof result).toBe('string');
    });

    it('should call LlmGateway with fast-chat and correct context', async () => {
        // Arrange
        const userId = 'user-123';
        const memoryId = 'memory-456';
        const message = 'Como está o clima hoje?';

        const mockResponse: LlmResponse = {
            content: 'Não tenho acesso a informações meteorológicas em tempo real.',
        };

        vi.mocked(mockLlmGateway.invoke).mockResolvedValue(mockResponse);

        // Act
        await thoughtCycleService.handle(userId, memoryId, message);

        // Assert
        expect(mockLlmGateway.invoke).toHaveBeenCalledWith(
            'fast-chat',
            expect.arrayContaining([
                expect.objectContaining({
                    role: 'user',
                    content: 'Olá, como você está?'
                }),
                expect.objectContaining({
                    role: 'assistant',
                    content: 'Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?'
                }),
                expect.objectContaining({
                    role: 'user',
                    content: message
                })
            ])
        );
    });

    it('should concatenate context from recent messages with new message', async () => {
        // Arrange
        const userId = 'user-123';
        const memoryId = 'memory-456';
        const message = 'Lembra do que conversamos antes?';

        const mockResponse: LlmResponse = {
            content: 'Sim, lembro que você me perguntou como eu estava.',
        };

        vi.mocked(mockLlmGateway.invoke).mockResolvedValue(mockResponse);

        // Act
        await thoughtCycleService.handle(userId, memoryId, message);

        // Assert
        const callArgs = vi.mocked(mockLlmGateway.invoke).mock.calls[0];
        const messages = callArgs[1];

        // Verifica que há pelo menos 3 mensagens (2 do contexto mock + 1 nova)
        expect(messages.length).toBeGreaterThanOrEqual(3);

        // Verifica que a última mensagem é a nova mensagem do usuário
        const lastMessage = messages[messages.length - 1];
        expect(lastMessage).toEqual({
            role: 'user',
            content: message
        });

        // Verifica que as mensagens anteriores são do contexto
        expect(messages[0]).toEqual({
            role: 'user',
            content: 'Olá, como você está?'
        });

        expect(messages[1]).toEqual({
            role: 'assistant',
            content: 'Olá! Estou bem, obrigado por perguntar. Como posso ajudá-lo hoje?'
        });
    });
});
