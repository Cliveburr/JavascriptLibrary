import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrontendChat } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface ChatState {
    // Lista de chats da memory selecionada
    chats: Array<FrontendChat>;
    // Chat atualmente selecionado (persistido)
    selectedChatId: string | null;
    // Estados de loading
    isLoading: boolean;

    // Actions para chats
    fetchChats: (memoryId: string) => Promise<void>;
    prepareNewChat: () => void;
    initNewChat: (memoryId: string) => FrontendChat;
    appendChatTitle: (chatId: string, content: string) => void;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string | null) => void;
    updateChatOrder: (chatId: string, newOrderIndex: number) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => {
            return {
                chats: [],
                selectedChatId: null,
                isLoading: false,

                fetchChats: async (memoryId: string) => {
                    set({ isLoading: true });
                    try {
                        const chats = await apiService.chat.fetchByMemory(memoryId);
                        set({
                            chats,
                            isLoading: false
                        });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                prepareNewChat: () => {
                    set({
                        selectedChatId: null
                    });
                },

                initNewChat: (chatId: string) => {
                    const newChat: FrontendChat = {
                        id: chatId,
                        title: ''
                    };

                    set(state => {
                        return {
                            chats: [newChat, ...state.chats],
                            selectedChatId: newChat.id
                        };
                    });

                    return newChat;
                },

                appendChatTitle: (chatId: string, content: string) => {
                    set(state => ({
                        chats: state.chats.map(chat =>
                            chat.id === chatId
                                ? { ...chat, title: chat.title + content }
                                : chat
                        )
                    }));
                },

                deleteChat: async (chatId: string) => {
                    set({ isLoading: true });
                    try {
                        await apiService.chat.delete(chatId);
                        set(state => ({
                            chats: state.chats.filter(chat => chat.id !== chatId),
                            selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId,
                            isLoading: false
                        }));
                    } catch (error) {
                        console.error('Erro ao deletar chat:', error);
                        set({ isLoading: false });
                        throw error;
                    }
                },

                selectChat: (chatId: string | null) => {
                    set({ selectedChatId: chatId });
                },

                updateChatOrder: async (chatId: string, newOrderIndex: number) => {
                    set({ isLoading: true });
                    try {
                        await apiService.chat.updateOrder(chatId, { orderIndex: newOrderIndex });

                        // Recarregar os chats para ter a ordem atualizada do servidor
                        const state = get();
                        const currentChat = state.chats.find(chat => chat.id === chatId);
                        if (currentChat) {
                            await get().fetchChats(currentChat.memoryId);
                        }

                        set({ isLoading: false });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },
            };
        },
        {
            name: 'chat-storage',
            partialize: (state) => ({
                selectedChatId: state.selectedChatId,
            }),
        }
    )
);
