import { create } from 'zustand';
import type { MessageDTO, ChatDTO } from '@symbia/interfaces';
import { useAuthStore } from './auth.store';

// Helper para chamadas à API
const getAuthToken = () => {
    const authState = useAuthStore.getState();
    return authState.token;
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

interface ChatState {
    // Chats organizados por memória
    chatsByMemory: Record<string, ChatDTO[]>;
    // Mensagens organizadas por chat
    messagesByChat: Record<string, MessageDTO[]>;
    // Chat atualmente selecionado
    selectedChatId: string | null;
    // Estados de loading
    isLoading: boolean;
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    error: string | null;

    // Actions para chats
    loadChatsByMemory: (memoryId: string) => Promise<void>;
    createChat: (memoryId: string, title?: string) => Promise<ChatDTO>;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string | null) => void;
    updateChatTitle: (chatId: string, title: string) => Promise<void>;
    updateChatOrder: (chatId: string, newOrderIndex: number) => Promise<void>;

    // Actions para mensagens
    loadMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string, llmSetId?: string) => Promise<void>;
    clearMessages: (chatId?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    chatsByMemory: {},
    messagesByChat: {},
    selectedChatId: null,
    isLoading: false,
    isLoadingChats: false,
    isLoadingMessages: false,
    error: null,

    loadChatsByMemory: async (memoryId: string) => {
        try {
            set({ isLoadingChats: true, error: null });

            const chats = await apiCall(`http://localhost:3002/chats?memoryId=${memoryId}`);

            set(state => ({
                chatsByMemory: {
                    ...state.chatsByMemory,
                    [memoryId]: chats
                },
                isLoadingChats: false
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load chats',
                isLoadingChats: false
            });
        }
    },

    createChat: async (memoryId: string, title = 'Novo Chat') => {
        try {
            set({ isLoading: true, error: null });

            const newChat = await apiCall('http://localhost:3002/chats', {
                method: 'POST',
                body: JSON.stringify({ memoryId, title }),
            });

            set(state => {
                const existingChats = state.chatsByMemory[memoryId] || [];
                return {
                    chatsByMemory: {
                        ...state.chatsByMemory,
                        [memoryId]: [...existingChats, newChat]
                    },
                    isLoading: false
                };
            });

            return newChat;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create chat',
                isLoading: false
            });
            throw error;
        }
    },

    deleteChat: async (chatId: string) => {
        try {
            set({ isLoading: true, error: null });

            await apiCall(`http://localhost:3002/chats/${chatId}`, {
                method: 'DELETE',
            });

            set(state => {
                const newChatsByMemory = { ...state.chatsByMemory };
                const newMessagesByChat = { ...state.messagesByChat };

                Object.keys(newChatsByMemory).forEach(memoryId => {
                    const chats = newChatsByMemory[memoryId];
                    if (chats) {
                        newChatsByMemory[memoryId] = chats.filter(
                            chat => chat.id !== chatId
                        );
                    }
                });

                delete newMessagesByChat[chatId];

                return {
                    chatsByMemory: newChatsByMemory,
                    messagesByChat: newMessagesByChat,
                    selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId,
                    isLoading: false
                };
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete chat',
                isLoading: false
            });
        }
    },

    selectChat: (chatId: string | null) => {
        set({ selectedChatId: chatId });
        if (chatId) {
            get().loadMessages(chatId);
        }
    },

    loadMessages: async (chatId: string) => {
        try {
            set({ isLoadingMessages: true, error: null });

            // Chama API real para carregar mensagens do chat
            const messages = await apiCall(`http://localhost:3002/chats/${chatId}/messages`);

            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: messages
                },
                isLoadingMessages: false
            }));

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to load messages',
                isLoadingMessages: false
            });
        }
    },

    sendMessage: async (chatId: string, content: string, llmSetId?: string) => {
        try {
            set({ isLoading: true, error: null });

            // Precisamos obter o memoryId do chat
            const state = get();
            let memoryId: string | null = null;

            // Busca memoryId nas estruturas existentes
            for (const [mId, chats] of Object.entries(state.chatsByMemory)) {
                if (chats.some(chat => chat.id === chatId)) {
                    memoryId = mId;
                    break;
                }
            }

            if (!memoryId) {
                throw new Error('Memory ID not found for this chat');
            }

            // Verifica se llmSetId foi fornecido
            if (!llmSetId) {
                throw new Error('LLM Set ID is required');
            }

            // Adiciona mensagem do usuário imediatamente
            const userMessage: MessageDTO = {
                id: `temp-user-${Date.now()}`,
                chatId,
                role: 'user',
                content,
                contentType: 'text',
                createdAt: new Date().toISOString()
            };

            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: [...(state.messagesByChat[chatId] || []), userMessage]
                }
            }));

            // Chama a API real do thought-cycle
            const response = await apiCall(`http://localhost:3002/chats/${memoryId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content, llmSetId }),
            });

            // Substitui mensagem temporária com as mensagens reais da API
            set(state => {
                const currentMessages = state.messagesByChat[chatId] || [];
                const messagesWithoutTemp = currentMessages.filter(m => m.id !== userMessage.id);

                return {
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: [
                            ...messagesWithoutTemp,
                            response.userMessage,
                            response.assistantMessage
                        ]
                    },
                    isLoading: false
                };
            });

        } catch (error) {
            console.error('Error sending message:', error);
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to send message'
            });
            throw error; // Re-throw para que o componente possa tratar
        }
    },

    clearMessages: (chatId?: string) => {
        if (chatId) {
            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: []
                },
                error: null
            }));
        } else {
            set({ messagesByChat: {}, error: null });
        }
    },

    updateChatTitle: async (chatId: string, title: string) => {
        try {
            set({ isLoading: true, error: null });
            const updatedChat = await apiCall(`http://localhost:3002/chats/${chatId}/title`, {
                method: 'PATCH',
                body: JSON.stringify({ title }),
            });
            set((state: ChatState) => {
                const chatsByMemory = { ...state.chatsByMemory };
                Object.keys(chatsByMemory).forEach(memoryId => {
                    if (chatsByMemory[memoryId]) {
                        chatsByMemory[memoryId] = chatsByMemory[memoryId].map((chat: ChatDTO) =>
                            chat.id === chatId ? { ...chat, title: updatedChat.title } : chat
                        );
                    }
                });
                return { chatsByMemory, isLoading: false };
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update chat title',
                isLoading: false
            });
        }
    },

    updateChatOrder: async (chatId: string, newOrderIndex: number) => {
        try {
            set({ isLoading: true, error: null });
            await apiCall(`http://localhost:3002/chats/${chatId}/order`, {
                method: 'PATCH',
                body: JSON.stringify({ orderIndex: newOrderIndex }),
            });

            // Recarregar a lista de chats para refletir a nova ordem
            const state = get();
            let memoryId: string | null = null;

            // Encontrar o memoryId do chat
            for (const [mId, chats] of Object.entries(state.chatsByMemory)) {
                if (chats.some(chat => chat.id === chatId)) {
                    memoryId = mId;
                    break;
                }
            }

            if (memoryId) {
                await get().loadChatsByMemory(memoryId);
            }

            set({ isLoading: false });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to update chat order',
                isLoading: false
            });
        }
    },
}));
