import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrontendChat } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface ChatState {
    // Chats organizados por memória
    chatsByMemory: Record<string, FrontendChat[]>;
    // Chat atualmente selecionado
    selectedChatId: string | null;
    // Último chat selecionado (persistido)
    lastSelectedChatId: string | null;
    // Estados de loading
    isLoading: boolean;
    isLoadingChats: boolean;

    // Actions para chats
    loadChatsByMemory: (memoryId: string) => Promise<void>;
    createChat: (memoryId: string, title?: string) => Promise<FrontendChat>;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string | null) => void;
    updateChatTitle: (chatId: string, title: string) => Promise<void>;
    updateChatOrder: (chatId: string, newOrderIndex: number) => Promise<void>;
    setLastSelectedChat: (chatId: string | null) => void;
    addChatToMemory: (memoryId: string, chat: FrontendChat) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => {
            return {
                chatsByMemory: {},
                selectedChatId: null,
                lastSelectedChatId: null,
                isLoading: false,
                isLoadingChats: false,

                loadChatsByMemory: async (memoryId: string) => {
                    set({ isLoadingChats: true });
                    try {
                        const chats = await apiService.chat.fetchByMemory(memoryId);
                        set(state => ({
                            chatsByMemory: {
                                ...state.chatsByMemory,
                                [memoryId]: chats
                            },
                            isLoadingChats: false
                        }));
                    } catch (error) {
                        set({ isLoadingChats: false });
                        throw error;
                    }
                },

                createChat: async (memoryId: string, title = 'Novo Chat') => {
                    set({ isLoading: true });
                    try {
                        const newChat = await apiService.chat.create({ memoryId, title });
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
                        set({ isLoading: false });
                        throw error;
                    }
                },

                deleteChat: async (chatId: string) => {
                    set({ isLoading: true });
                    try {
                        await apiService.chat.delete(chatId);
                        set(state => {
                            const newChatsByMemory = { ...state.chatsByMemory };

                            Object.keys(newChatsByMemory).forEach(memoryId => {
                                const chats = newChatsByMemory[memoryId];
                                if (chats) {
                                    newChatsByMemory[memoryId] = chats.filter(
                                        chat => chat.id !== chatId
                                    );
                                }
                            });

                            return {
                                chatsByMemory: newChatsByMemory,
                                selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId,
                                isLoading: false
                            };
                        });
                    } catch (error) {
                        console.error('Erro ao deletar chat:', error);
                        set({ isLoading: false });
                        throw error;
                    }
                },

                selectChat: (chatId: string | null) => {
                    console.log('Store selectChat called:', { chatId });
                    set({ selectedChatId: chatId });
                },

                updateChatTitle: async (chatId: string, title: string) => {
                    set({ isLoading: true });
                    try {
                        const updatedChat = await apiService.chat.updateTitle(chatId, { title });
                        set((state: ChatState) => {
                            const chatsByMemory = { ...state.chatsByMemory };
                            Object.keys(chatsByMemory).forEach(memoryId => {
                                if (chatsByMemory[memoryId]) {
                                    chatsByMemory[memoryId] = chatsByMemory[memoryId].map((chat: FrontendChat) =>
                                        chat.id === chatId ? { ...chat, title: updatedChat.title } : chat
                                    );
                                }
                            });
                            return { chatsByMemory, isLoading: false };
                        });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                updateChatOrder: async (chatId: string, newOrderIndex: number) => {
                    set({ isLoading: true });
                    try {
                        await apiService.chat.updateOrder(chatId, { orderIndex: newOrderIndex });

                        const state = get();
                        let memoryId: string | null = null;

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
                        set({ isLoading: false });
                        throw error;
                    }
                },

                addChatToMemory: (memoryId: string, chat: FrontendChat) => {
                    set(state => {
                        const existingChats = state.chatsByMemory[memoryId] || [];
                        const updatedChats = [chat, ...existingChats.map(c => ({ ...c, orderIndex: c.orderIndex + 1 }))];

                        return {
                            chatsByMemory: {
                                ...state.chatsByMemory,
                                [memoryId]: updatedChats
                            }
                        };
                    });
                },

                setLastSelectedChat: (chatId: string | null) => {
                    set({ lastSelectedChatId: chatId });
                },
            };
        },
        {
            name: 'chat-storage',
            partialize: (state) => ({
                lastSelectedChatId: state.lastSelectedChatId,
            }),
        }
    )
);
