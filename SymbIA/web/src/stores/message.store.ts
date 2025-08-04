import { create } from 'zustand';
import type { FrontendMessage } from '../types/chat-frontend-types';
import { apiService } from '../utils/apiService';

interface MessageState {
    messages: FrontendMessage[];
    isLoading: boolean;
    loadMessages: (chatId: string) => Promise<void>;
    addMessage: (message: FrontendMessage) => void;
    streamTextMessage: (content: string) => void;
    updateMessage: (id: string) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => {

    function clearThinking(messages: FrontendMessage[]): FrontendMessage[] {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.id == 'Thinking') {
            return messages.slice(0, -1);
        } else {
            return [...messages];
        }
    }

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
                const newMessages = clearThinking(state.messages);
                newMessages.push(message);
                return { messages: newMessages };
            });
        },

        streamTextMessage: (content: string) => {
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

        updateMessage: (id: string) => {
            set(state => {
                const newMessages = [...state.messages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage) {
                    newMessages[newMessages.length - 1] = {
                        ...lastMessage,
                        id
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
