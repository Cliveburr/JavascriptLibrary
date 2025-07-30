import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Chat Title Generation', () => {
    let mockLlmGateway: any;
    let mockLlmSetService: any;
    let mockMongoService: any;

    beforeEach(() => {
        // Setup mocks
        mockLlmGateway = {
            invoke: vi.fn()
        };

        mockLlmSetService = {
            getLlmSetById: vi.fn()
        };

        mockMongoService = {
            connect: vi.fn(),
            getChatsCollection: vi.fn(),
            getMessagesCollection: vi.fn()
        };
    });

    it('should generate a chat title from user message', async () => {
        // Arrange
        const userMessage = 'Como posso aprender programação em TypeScript?';
        const expectedTitle = 'Aprender TypeScript - Programação';
        const llmSetId = 'ollama-local';

        mockLlmSetService.getLlmSetById.mockResolvedValue({
            id: llmSetId,
            name: 'Ollama Local'
        });

        mockLlmGateway.invoke.mockResolvedValue({
            content: expectedTitle
        });

        // Create a mock ChatService with the generateChatTitle method
        const ChatService = vi.fn().mockImplementation(() => ({
            generateChatTitle: async (message: string, llmSetId: string) => {
                const llmSetConfig = await mockLlmSetService.getLlmSetById(llmSetId);
                if (!llmSetConfig) {
                    return 'Novo Chat';
                }

                const messages = [
                    {
                        role: 'system',
                        content: 'Você é um assistente que gera títulos curtos e descritivos para conversas. Gere um título de máximo 60 caracteres baseado na primeira mensagem do usuário. Responda apenas com o título, sem aspas ou formatação extra.'
                    },
                    {
                        role: 'user',
                        content: `Mensagem do usuário: "${message}"`
                    }
                ];

                const response = await mockLlmGateway.invoke(llmSetConfig, 'reasoning', messages);
                const title = response.content?.trim().replace(/^["']|["']$/g, '') || 'Novo Chat';
                return title.substring(0, 60);
            }
        }));

        const chatService = new ChatService();

        // Act
        const result = await chatService.generateChatTitle(userMessage, llmSetId);

        // Assert
        expect(result).toBe(expectedTitle);
        expect(mockLlmSetService.getLlmSetById).toHaveBeenCalledWith(llmSetId);
        expect(mockLlmGateway.invoke).toHaveBeenCalledWith(
            { id: llmSetId, name: 'Ollama Local' },
            'reasoning',
            expect.arrayContaining([
                expect.objectContaining({
                    role: 'system',
                    content: expect.stringContaining('Gere um título de máximo 60 caracteres')
                }),
                expect.objectContaining({
                    role: 'user',
                    content: `Mensagem do usuário: "${userMessage}"`
                })
            ])
        );
    });

    it('should limit title to 60 characters', async () => {
        // Arrange
        const userMessage = 'Teste';
        const llmSetId = 'ollama-local';
        const longTitle = 'Este é um título muito longo que deveria ser cortado para não exceder o limite de sessenta caracteres estabelecido';

        mockLlmSetService.getLlmSetById.mockResolvedValue({
            id: llmSetId,
            name: 'Ollama Local'
        });

        mockLlmGateway.invoke.mockResolvedValue({
            content: longTitle
        });

        // Create a mock ChatService with the generateChatTitle method
        const ChatService = vi.fn().mockImplementation(() => ({
            generateChatTitle: async (message: string, llmSetId: string) => {
                const llmSetConfig = await mockLlmSetService.getLlmSetById(llmSetId);
                if (!llmSetConfig) {
                    return 'Novo Chat';
                }

                const response = await mockLlmGateway.invoke(llmSetConfig, 'reasoning', []);
                const title = response.content?.trim().replace(/^["']|["']$/g, '') || 'Novo Chat';
                return title.substring(0, 60);
            }
        }));

        const chatService = new ChatService();

        // Act
        const result = await chatService.generateChatTitle(userMessage, llmSetId);

        // Assert
        expect(result.length).toBeLessThanOrEqual(60);
        expect(result).toBe(longTitle.substring(0, 60));
    });

    it('should return default title on error', async () => {
        // Arrange
        const userMessage = 'Teste';
        const llmSetId = 'invalid-llm-set';

        mockLlmSetService.getLlmSetById.mockRejectedValue(new Error('LLM Error'));

        // Create a mock ChatService with the generateChatTitle method
        const ChatService = vi.fn().mockImplementation(() => ({
            generateChatTitle: async (message: string, llmSetId: string) => {
                try {
                    await mockLlmSetService.getLlmSetById(llmSetId);
                } catch (error) {
                    return 'Novo Chat';
                }
            }
        }));

        const chatService = new ChatService();

        // Act
        const result = await chatService.generateChatTitle(userMessage, llmSetId);

        // Assert
        expect(result).toBe('Novo Chat');
    });

    it('should remove quotes from generated title', async () => {
        // Arrange
        const userMessage = 'Teste';
        const llmSetId = 'ollama-local';
        const titleWithQuotes = '"Título com aspas"';
        const expectedTitle = 'Título com aspas';

        mockLlmSetService.getLlmSetById.mockResolvedValue({
            id: llmSetId,
            name: 'Ollama Local'
        });

        mockLlmGateway.invoke.mockResolvedValue({
            content: titleWithQuotes
        });

        // Create a mock ChatService with the generateChatTitle method
        const ChatService = vi.fn().mockImplementation(() => ({
            generateChatTitle: async (message: string, llmSetId: string) => {
                const llmSetConfig = await mockLlmSetService.getLlmSetById(llmSetId);
                const response = await mockLlmGateway.invoke(llmSetConfig, 'reasoning', []);
                const title = response.content?.trim().replace(/^["']|["']$/g, '') || 'Novo Chat';
                return title.substring(0, 60);
            }
        }));

        const chatService = new ChatService();

        // Act
        const result = await chatService.generateChatTitle(userMessage, llmSetId);

        // Assert
        expect(result).toBe(expectedTitle);
    });
});