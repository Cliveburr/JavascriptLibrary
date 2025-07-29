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
    selectChat: (chatId: string) => void;

    // Actions para mensagens
    loadMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string) => Promise<void>;
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

                // Remover chat de todas as memórias
                Object.keys(newChatsByMemory).forEach(memoryId => {
                    const chats = newChatsByMemory[memoryId];
                    if (chats) {
                        newChatsByMemory[memoryId] = chats.filter(
                            chat => chat.id !== chatId
                        );
                    }
                });

                // Remover mensagens do chat
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

    selectChat: (chatId: string) => {
        set({ selectedChatId: chatId });
        // Carregar mensagens automaticamente quando um chat é selecionado
        get().loadMessages(chatId);
    },

    loadMessages: async (chatId: string) => {
        try {
            set({ isLoadingMessages: true, error: null });

            // Mock data por enquanto - substituir por API real
            const mockMessages: MessageDTO[] = [
                {
                    id: `msg-1-${chatId}`,
                    chatId,
                    role: 'user',
                    content: 'Olá! Como você pode me ajudar?',
                    contentType: 'text',
                    createdAt: new Date(Date.now() - 60000).toISOString()
                },
                {
                    id: `msg-2-${chatId}`,
                    chatId,
                    role: 'assistant',
                    content: 'Olá! Sou seu assistente IA. Posso ajudar com diversas tarefas como responder perguntas, ajudar com análises, criar conteúdo e muito mais. Em que posso te ajudar hoje?',
                    contentType: 'text',
                    createdAt: new Date().toISOString()
                }
            ];

            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 500));

            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: mockMessages
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

    sendMessage: async (chatId: string, content: string) => {
        try {
            set({ isLoading: true, error: null });

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

            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Criar resposta do assistente
            const assistantMessage: MessageDTO = {
                id: `msg-${Date.now()}`,
                chatId,
                role: 'assistant',
                content: `Entendi sua mensagem: "${content}". Esta é uma resposta simulada do assistente IA.`,
                contentType: 'text',
                createdAt: new Date().toISOString()
            };

            // Substitui mensagem temporária e adiciona resposta
            set(state => {
                const currentMessages = state.messagesByChat[chatId] || [];
                const messagesWithoutTemp = currentMessages.filter(m => m.id !== userMessage.id);

                const finalUserMessage = { ...userMessage, id: `msg-user-${Date.now()}` };

                return {
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: [...messagesWithoutTemp, finalUserMessage, assistantMessage]
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
    }
}));
