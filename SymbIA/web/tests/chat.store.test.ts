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
            messages: [],
            isLoading: false,
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

        await useChatStore.getState().sendMessage('test-memory', 'Hello');

        expect(mockFetch).toHaveBeenCalledWith('/api/chats/test-memory/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
            },
            body: JSON.stringify({ content: 'Hello' })
        });

        const state = useChatStore.getState();
        expect(state.messages).toHaveLength(2);
        expect(state.messages[0].role).toBe('user');
        expect(state.messages[1].role).toBe('assistant');
        expect(state.isLoading).toBe(false);
    });

    it('should handle errors correctly', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        await useChatStore.getState().sendMessage('test-memory', 'Hello');

        const state = useChatStore.getState();
        expect(state.error).toBe('Network error');
        expect(state.isLoading).toBe(false);
    });

    it('should clear messages', () => {
        const store = useChatStore.getState();

        // Add some messages first
        store.sendMessage('test-memory', 'Test');

        store.clearMessages();

        expect(store.messages).toHaveLength(0);
        expect(store.error).toBeNull();
    });
});
