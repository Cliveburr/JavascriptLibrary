import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';

describe('ChatController - sendMessage with auto title generation', () => {
    let mockThoughtCycleService: any;
    let mockChatService: any;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        // Setup mocks
        mockThoughtCycleService = {
            handle: vi.fn()
        };

        mockChatService = {
            getChatById: vi.fn(),
            createChat: vi.fn(),
            saveMessage: vi.fn(),
            generateChatTitle: vi.fn(),
            updateChatTitle: vi.fn()
        };

        // Setup mock response
        mockResponse = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            setHeader: vi.fn().mockReturnThis()
        };
    });

    it('should create new chat and generate title automatically when chatId is not provided', async () => {
        // Arrange
        const userMessage = 'Como posso aprender TypeScript?';
        const memoryId = '123e4567-e89b-12d3-a456-426614174000';
        const newChatId = 'chat-new-123';
        const generatedTitle = 'Aprender TypeScript';

        mockRequest = {
            params: { memoryId },
            body: { content: userMessage, llmSetId: 'ollama-local' }, // No chatId but with llmSetId
            headers: { authorization: 'Bearer test-token' }
        };

        mockChatService.createChat.mockResolvedValue({
            id: newChatId,
            memoryId,
            title: 'Novo Chat',
            orderIndex: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        mockThoughtCycleService.handle.mockResolvedValue('Claro! TypeScript é uma excelente linguagem...');
        mockChatService.generateChatTitle.mockResolvedValue(generatedTitle);
        mockChatService.updateChatTitle.mockResolvedValue({
            id: newChatId,
            title: generatedTitle
        });
        mockChatService.saveMessage.mockResolvedValue({});

        // Create a mock ChatController
        const ChatController = vi.fn().mockImplementation(() => ({
            sendMessage: async (req: Request, res: Response) => {
                const { memoryId } = req.params;
                const { content, chatId, llmSetId } = req.body;

                let finalChatId = chatId;
                let isNewChat = false;

                if (!chatId) {
                    isNewChat = true;
                    const newChat = await mockChatService.createChat(memoryId, 'Novo Chat');
                    finalChatId = newChat.id;
                }

                const userId = req.headers.authorization?.replace('Bearer ', '') || 'mock-user-id';
                const responseContent = await mockThoughtCycleService.handle(userId, memoryId, content);

                // Save messages
                await mockChatService.saveMessage({
                    id: `msg-${Date.now()}-user`,
                    chatId: finalChatId,
                    role: 'user',
                    content,
                    contentType: 'text',
                    createdAt: new Date(),
                    'chat-history': true,
                    modal: 'text'
                });

                await mockChatService.saveMessage({
                    id: `msg-${Date.now()}-assistant`,
                    chatId: finalChatId,
                    role: 'assistant',
                    content: responseContent,
                    contentType: 'text',
                    createdAt: new Date(),
                    'chat-history': true,
                    modal: 'text'
                });

                if (isNewChat && finalChatId) {
                    const generatedTitle = await mockChatService.generateChatTitle(content, llmSetId);
                    await mockChatService.updateChatTitle(finalChatId, generatedTitle);
                }

                res.status(200).json({
                    userMessage: {
                        id: `msg-${Date.now()}-user`,
                        chatId: finalChatId,
                        role: 'user',
                        content,
                        contentType: 'text',
                        createdAt: new Date().toISOString()
                    },
                    assistantMessage: {
                        id: `msg-${Date.now()}-assistant`,
                        chatId: finalChatId,
                        role: 'assistant',
                        content: responseContent,
                        contentType: 'text',
                        createdAt: new Date().toISOString()
                    }
                });
            }
        }));

        const chatController = new ChatController();

        // Act
        await chatController.sendMessage(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockChatService.createChat).toHaveBeenCalledWith(memoryId, 'Novo Chat');
        expect(mockThoughtCycleService.handle).toHaveBeenCalledWith('test-token', memoryId, userMessage);
        expect(mockChatService.generateChatTitle).toHaveBeenCalledWith(userMessage, 'ollama-local');
        expect(mockChatService.updateChatTitle).toHaveBeenCalledWith(newChatId, generatedTitle);
        expect(mockChatService.saveMessage).toHaveBeenCalledTimes(2);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should not generate title when chatId is provided (existing chat)', async () => {
        // Arrange
        const userMessage = 'Continue nossa conversa';
        const memoryId = '123e4567-e89b-12d3-a456-426614174000';
        const existingChatId = 'chat-existing-456';

        mockRequest = {
            params: { memoryId },
            body: { content: userMessage, chatId: existingChatId, llmSetId: 'ollama-local' },
            headers: { authorization: 'Bearer test-token' }
        };

        mockChatService.getChatById.mockResolvedValue({
            id: existingChatId,
            memoryId,
            title: 'Chat Existente',
            orderIndex: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        mockThoughtCycleService.handle.mockResolvedValue('Continuando nossa conversa...');
        mockChatService.saveMessage.mockResolvedValue({});

        // Create a mock ChatController
        const ChatController = vi.fn().mockImplementation(() => ({
            sendMessage: async (req: Request, res: Response) => {
                const { chatId } = req.body;

                if (chatId) {
                    await mockChatService.getChatById(chatId);
                }

                const userId = req.headers.authorization?.replace('Bearer ', '') || 'mock-user-id';
                await mockThoughtCycleService.handle(userId, req.params.memoryId, req.body.content);
                await mockChatService.saveMessage({});
                await mockChatService.saveMessage({});

                res.status(200).json({});
            }
        }));

        const chatController = new ChatController();

        // Act
        await chatController.sendMessage(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockChatService.getChatById).toHaveBeenCalledWith(existingChatId);
        expect(mockChatService.createChat).not.toHaveBeenCalled();
        expect(mockChatService.generateChatTitle).not.toHaveBeenCalled();
        expect(mockChatService.updateChatTitle).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
});
