import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from '../src/stores/chat.store';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
    removeItem: vi.fn(),
    key: vi.fn(),
    length: 0,
};
Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
});

describe('Chat Store', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            state: { token: 'test-token' }
        }));

        // Reset store state
        useChatStore.setState({
            chatsByMemory: {},
            messagesByChat: {},
            selectedChatId: null,
            isLoading: false,
            isLoadingChats: false,
            isLoadingMessages: false,
            error: null
        });
    });

    it('should send message and update store', async () => {
        const mockResponse = {
            userMessage: {
                id: 'user-1',
                chatId: 'chat-test-memory',
                role: 'user',
                content: 'Hello',
                contentType: 'text',
                createdAt: new Date().toISOString()
            },
            assistantMessage: {
                id: 'assistant-1',
                chatId: 'chat-test-memory',
                role: 'assistant',
                content: 'Hi there!',
                contentType: 'text',
                createdAt: new Date().toISOString()
            }
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        // Setup chat to simulate it exists
        useChatStore.setState({
            chatsByMemory: {
                'test-memory': [{
                    id: 'chat-test-memory',
                    memoryId: 'test-memory',
                    title: 'Test Chat',
                    orderIndex: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }]
            }
        });

        await useChatStore.getState().sendMessage('chat-test-memory', 'Hello', 'test-llm-set');

        expect(mockFetch).toHaveBeenCalledWith('http://localhost:3002/chats/test-memory/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: 'Hello', llmSetId: 'test-llm-set' })
        });

        const state = useChatStore.getState();
        const chatMessages = state.messagesByChat['chat-test-memory'] || [];
        expect(chatMessages).toHaveLength(2);
        expect(chatMessages[0].role).toBe('user');
        expect(chatMessages[1].role).toBe('assistant');
        expect(state.isLoading).toBe(false);
    });

    it('should handle errors correctly', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        // Setup chat to simulate it exists
        useChatStore.setState({
            chatsByMemory: {
                'test-memory': [{
                    id: 'chat-test-memory',
                    memoryId: 'test-memory',
                    title: 'Test Chat',
                    orderIndex: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }]
            }
        });

        try {
            await useChatStore.getState().sendMessage('chat-test-memory', 'Hello', 'test-llm-set');
        } catch (error) {
            // Expected to throw
        }

        const state = useChatStore.getState();
        expect(state.error).toBe('Network error');
        expect(state.isLoading).toBe(false);
    });

    it('should clear messages', () => {
        const store = useChatStore.getState();

        // Add some messages first
        store.clearMessages('test-chat');

        expect(store.messagesByChat['test-chat']).toBeUndefined();
        expect(store.error).toBeNull();
    });
});
