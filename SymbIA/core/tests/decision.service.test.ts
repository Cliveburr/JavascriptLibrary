import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DecisionService, DecisionServiceError } from '../src/planner/decision.service.js';
import { LlmGateway } from '../src/llm/LlmGateway.js';
import { LlmSetService } from '../src/llm/llm-set.service.js';
import { MongoDBService } from '../src/database/mongodb.service.js';
import * as actionRegistry from '../src/actions/action.registry.js';

// Mock dependencies
vi.mock('../src/llm/LlmGateway.js');
vi.mock('../src/llm/llm-set.service.js');
vi.mock('../src/database/mongodb.service.js');
vi.mock('../src/actions/action.registry.js');

const MockedLlmGateway = vi.mocked(LlmGateway);
const MockedLlmSetService = vi.mocked(LlmSetService);
const MockedMongoDBService = vi.mocked(MongoDBService);

describe('DecisionService', () => {
    let decisionService: DecisionService;
    let mockLlmGateway: any;
    let mockLlmSetService: any;
    let mockMongoDBService: any;
    let mockCollection: any;
    let mockDb: any;

    beforeEach(() => {
        vi.clearAllMocks();

        // Mock MongoDB collection and database
        mockCollection = {
            find: vi.fn().mockReturnThis(),
            sort: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            toArray: vi.fn()
        };

        mockDb = {
            collection: vi.fn().mockReturnValue(mockCollection)
        };

        mockMongoDBService = {
            connect: vi.fn().mockResolvedValue(undefined),
            getDatabase: vi.fn().mockResolvedValue(mockDb)
        };

        mockLlmSetService = {
            getLlmSetById: vi.fn()
        };

        mockLlmGateway = {
            invoke: vi.fn()
        };

        MockedMongoDBService.mockImplementation(() => mockMongoDBService);
        MockedLlmSetService.mockImplementation(() => mockLlmSetService);
        MockedLlmGateway.mockImplementation(() => mockLlmGateway);

        decisionService = new DecisionService(mockLlmGateway, mockLlmSetService, mockMongoDBService);
    });

    describe('decide', () => {
        it('should return action name when LLM responds with "Finalize"', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Hello, how are you?';

            // Mock chat history
            const mockChatHistory = [
                {
                    id: 'msg1',
                    chatId: chatId,
                    role: 'user',
                    content: 'Previous message',
                    contentType: 'text',
                    createdAt: new Date()
                }
            ];
            mockCollection.toArray.mockResolvedValue(mockChatHistory);

            // Mock enabled actions
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['Finalize', 'MemorySearch']);

            // Mock LLM set
            const mockLlmSet = {
                id: 'reasoning-heavy',
                models: {
                    reasoningHeavy: {
                        provider: 'ollama',
                        model: 'test-model'
                    }
                }
            };
            mockLlmSetService.getLlmSetById.mockResolvedValue(mockLlmSet);

            // Mock LLM response
            const mockLlmResponse = {
                content: 'Finalize',
                usage: { promptTokens: 100, completionTokens: 1, totalTokens: 101 }
            };
            mockLlmGateway.invoke.mockResolvedValue(mockLlmResponse);

            // Act
            const result = await decisionService.decide(userId, memoryId, chatId, message);

            // Assert
            expect(result).toBe('Finalize');
            expect(mockLlmGateway.invoke).toHaveBeenCalledWith(
                mockLlmSet,
                [{ role: 'user', content: expect.stringContaining('Hello, how are you?') }],
                {
                    temperature: 0.1,
                    maxTokens: 50
                }
            );
        });

        it('should handle case-insensitive action matching', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Search for something';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['MemorySearch', 'Finalize']);

            const mockLlmSet = {
                id: 'reasoning-heavy',
                models: { reasoningHeavy: { provider: 'ollama', model: 'test-model' } }
            };
            mockLlmSetService.getLlmSetById.mockResolvedValue(mockLlmSet);

            const mockLlmResponse = {
                content: 'memorysearch',  // lowercase response
                usage: { promptTokens: 100, completionTokens: 1, totalTokens: 101 }
            };
            mockLlmGateway.invoke.mockResolvedValue(mockLlmResponse);

            // Act
            const result = await decisionService.decide(userId, memoryId, chatId, message);

            // Assert
            expect(result).toBe('MemorySearch');
        });

        it('should fallback to reasoning set when reasoning-heavy is not available', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Test message';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['Finalize']);

            // Mock reasoning-heavy not available, but reasoning available
            mockLlmSetService.getLlmSetById
                .mockResolvedValueOnce(null) // reasoning-heavy not found
                .mockResolvedValueOnce({     // reasoning found
                    id: 'reasoning',
                    models: { reasoning: { provider: 'ollama', model: 'test-model' } }
                });

            const mockLlmResponse = {
                content: 'Finalize',
                usage: { promptTokens: 100, completionTokens: 1, totalTokens: 101 }
            };
            mockLlmGateway.invoke.mockResolvedValue(mockLlmResponse);

            // Act
            const result = await decisionService.decide(userId, memoryId, chatId, message);

            // Assert
            expect(result).toBe('Finalize');
            expect(mockLlmSetService.getLlmSetById).toHaveBeenCalledWith('reasoning-heavy');
            expect(mockLlmSetService.getLlmSetById).toHaveBeenCalledWith('reasoning');
        });

        it('should default to Finalize when action not found in response', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Test message';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['Finalize', 'MemorySearch']);

            const mockLlmSet = {
                id: 'reasoning-heavy',
                models: { reasoningHeavy: { provider: 'ollama', model: 'test-model' } }
            };
            mockLlmSetService.getLlmSetById.mockResolvedValue(mockLlmSet);

            const mockLlmResponse = {
                content: 'InvalidAction',  // Not in enabled actions
                usage: { promptTokens: 100, completionTokens: 1, totalTokens: 101 }
            };
            mockLlmGateway.invoke.mockResolvedValue(mockLlmResponse);

            // Act
            const result = await decisionService.decide(userId, memoryId, chatId, message);

            // Assert
            expect(result).toBe('Finalize');
        });

        it('should throw error for missing userId', async () => {
            await expect(decisionService.decide('', 'memory123', 'chat123', 'message'))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error for missing memoryId', async () => {
            await expect(decisionService.decide('user123', '', 'chat123', 'message'))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error for missing chatId', async () => {
            await expect(decisionService.decide('user123', 'memory123', '', 'message'))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error for missing message', async () => {
            await expect(decisionService.decide('user123', 'memory123', 'chat123', ''))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error when no actions are available', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Test message';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue([]);

            // Act & Assert
            await expect(decisionService.decide(userId, memoryId, chatId, message))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error when no suitable LLM set is found', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Test message';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['Finalize']);

            // Mock both reasoning-heavy and reasoning not available
            mockLlmSetService.getLlmSetById.mockResolvedValue(null);

            // Act & Assert
            await expect(decisionService.decide(userId, memoryId, chatId, message))
                .rejects.toThrow(DecisionServiceError);
        });

        it('should throw error when LLM returns empty response', async () => {
            // Arrange
            const userId = 'user123';
            const memoryId = 'memory123';
            const chatId = 'chat123';
            const message = 'Test message';

            mockCollection.toArray.mockResolvedValue([]);
            vi.mocked(actionRegistry.getEnabledActionNames).mockReturnValue(['CustomAction']); // No Finalize available

            const mockLlmSet = {
                id: 'reasoning-heavy',
                models: { reasoningHeavy: { provider: 'ollama', model: 'test-model' } }
            };
            mockLlmSetService.getLlmSetById.mockResolvedValue(mockLlmSet);

            const mockLlmResponse = {
                content: '',  // Empty response
                usage: { promptTokens: 100, completionTokens: 0, totalTokens: 100 }
            };
            mockLlmGateway.invoke.mockResolvedValue(mockLlmResponse);

            // Act & Assert
            await expect(decisionService.decide(userId, memoryId, chatId, message))
                .rejects.toThrow(DecisionServiceError);
        });
    });
});
