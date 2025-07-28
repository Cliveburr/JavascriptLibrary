import { create } from 'zustand';
import type { MessageDTO } from '@symbia/interfaces';

interface ChatState {
    messages: MessageDTO[];
    isLoading: boolean;
    error: string | null;
    sendMessage: (memoryId: string, content: string) => Promise<void>;
    clearMessages: () => void;
}

const getAuthToken = () => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token;
    }
    return null;
};

const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    isLoading: false,
    error: null,

    sendMessage: async (memoryId: string, content: string) => {
        try {
            set({ isLoading: true, error: null });

            // Adiciona mensagem do usuário imediatamente
            const userMessage: MessageDTO = {
                id: `temp-user-${Date.now()}`,
                chatId: `chat-${memoryId}`,
                role: 'user',
                content,
                contentType: 'text',
                createdAt: new Date().toISOString()
            };

            set(state => ({
                messages: [...state.messages, userMessage]
            }));

            // Envia para a API
            const response = await apiCall(`/api/chats/${memoryId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content })
            });

            // Remove mensagem temporária e adiciona as mensagens reais
            set(state => {
                const messagesWithoutTemp = state.messages.filter(m => m.id !== userMessage.id);
                return {
                    messages: [...messagesWithoutTemp, response.userMessage, response.assistantMessage],
                    isLoading: false
                };
            });

        } catch (error) {
            console.error('Error sending message:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to send message'
            });
        }
    },

    clearMessages: () => {
        set({ messages: [], error: null });
    }
}));
