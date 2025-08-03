import { create } from 'zustand';
import type { FrontendMessage } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface MessageState {
    // Lista de mensagens do chat selecionado
    messages: FrontendMessage[];
    // Estado de loading
    isLoading: boolean;

    // Actions
    loadMessages: (chatId: string) => Promise<void>;
    addMessage: (message: FrontendMessage) => void;
    appendMessage: (content: string) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => {
    return {
        messages: [],
        isLoading: false,

        loadMessages: async (chatId: string) => {
            set({ isLoading: true });
            try {
                const messages = await apiService.message.fetch(chatId);
                set({
                    messages: messages,
                    isLoading: false
                });
            } catch (error) {
                set({ isLoading: false });
                throw error;
            }
        },

        addMessage: (message: FrontendMessage) => {
            set(state => {
                const newMessages = [...state.messages];

                // Se a última mensagem for do tipo "Thinking", substitua ela
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant' &&
                    lastMessage.content === 'Thinking...' || lastMessage.content === '') {
                    newMessages[newMessages.length - 1] = message;
                } else {
                    newMessages.push(message);
                }

                return { messages: newMessages };
            });
        },

        appendMessage: (content: string) => {
            set(state => {
                const newMessages = [...state.messages];
                const lastMessage = newMessages[newMessages.length - 1];

                if (lastMessage) {
                    newMessages[newMessages.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + content
                    };
                }

                return { messages: newMessages };
            });
        },

        clearMessages: () => {
            set({ messages: [] });
        },
    };
});
