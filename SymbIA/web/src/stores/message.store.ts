import { create } from 'zustand';
import type { AssistantModal, FrontendChatIterationDTO, } from '../types';
import { apiService } from '../utils/apiService';

interface MessageState {
    iterations: FrontendChatIterationDTO[];
    isLoading: boolean;
    loadMessages: (chatId: string) => Promise<void>;
    addIteration: (userMessage: string) => void;
    addAssistantMessage: (modal: AssistantModal, content: string) => void;
    updateLastAssistantContent: (content: string) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => {

    return {
        iterations: [],
        isLoading: false,

        loadMessages: async (chatId: string) => {
            set({ isLoading: true });
            try {
                const iterations = await apiService.message.fetch(chatId);
                set({ iterations, isLoading: false });
            } catch (error) {
                set({ isLoading: false });
                throw error;
            }
        },

        addIteration: (userMessage: string) => {
            set(state => ({
                iterations: [...state.iterations, { userMessage, assistants: [] }]
            }));
        },

        addAssistantMessage: (modal: AssistantModal, content: string) => {
            set(state => {
                const iterations = [...state.iterations];
                const current = iterations[iterations.length - 1];
                if (!current) {
                    throw 'Invalid add without iteration! ';
                }
                current.assistants.push({
                    modal: modal,
                    content: content,
                    inPrepare: true,
                    isExpanded: true
                });
                return { iterations };
            });
        },

        updateLastAssistantContent: (content: string) => {
            set(state => {
                const iterations = [...state.iterations];
                const current = iterations[iterations.length - 1];
                if (!current) {
                    throw 'Invalid update without iteration! ';
                }
                const lastAssistant = current.assistants[current.assistants.length - 1];
                if (!lastAssistant) {
                    throw 'Invalid update without assistant!';
                }
                if (lastAssistant.inPrepare) {
                    lastAssistant.content = content;
                    lastAssistant.inPrepare = false;
                } else {
                    lastAssistant.content += content;
                }
                return { iterations };
            });
        },

        clearMessages: () => {
            set({ iterations: [] });
        },
    };
});
