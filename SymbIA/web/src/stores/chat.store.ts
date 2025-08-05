import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrontendChat } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface ChatState {
    chats: Array<FrontendChat>;
    selectedChatId: string | null;
    isLoading: boolean;
    fetchChats: (memoryId: string) => Promise<void>;
    initNewChat: (chatId: string, orderIndex: number) => void;
    appendChatTitle: (content: string) => void;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string | null) => void;
    //updateChatOrder: (chatId: string, newOrderIndex: number) => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => {
            return {
                chats: [] as Array<FrontendChat>,
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

                initNewChat: (chatId: string, orderIndex: number) => {
                    set(state => {
                        const chat = {
                            chatId,
                            title: '',
                            orderIndex
                        };
                        return {
                            chats: [chat, ...state.chats],
                            selectedChatId: chat.chatId
                        };
                    });
                },

                appendChatTitle: (content: string) => {
                    set(state => ({
                        chats: state.chats.map(chat =>
                            chat.chatId === state.selectedChatId
                                ? { ...chat, title: (chat.title || '') + content }
                                : chat
                        )
                    }));
                },

                deleteChat: async (chatId: string) => {
                    set({ isLoading: true });
                    try {
                        await apiService.chat.delete(chatId);
                        set(state => ({
                            chats: state.chats.filter(chat => chat.chatId !== chatId),
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

                // updateChatOrder: async (chatId: string, newOrderIndex: number) => {
                //     set({ isLoading: true });
                //     try {
                //         await apiService.chat.updateOrder(chatId, { orderIndex: newOrderIndex });

                //         // Recarregar os chats para ter a ordem atualizada do servidor
                //         const state = get();
                //         const currentChat = state.chats.find(chat => chat.id === chatId);
                //         if (currentChat) {
                //             await get().fetchChats(currentChat.memoryId);
                //         }

                //         set({ isLoading: false });
                //     } catch (error) {
                //         set({ isLoading: false });
                //         throw error;
                //     }
                // },
            };
        },
        {
            name: 'chat-storage',
            partialize: (state) => ({
                selectedChatId: state.selectedChatId,
                // Optionally persist recent chats for better UX
                // chats: state.chats.slice(0, 10), // Keep only the 10 most recent
            }),
        }
    )
);
