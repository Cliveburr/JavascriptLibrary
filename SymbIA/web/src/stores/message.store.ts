import { create } from 'zustand';
import type { ChatStreamMessage, MessageModalType, MessageReflectionModal, MessageMemoryModal, FrontendChatIteration, ChatIterationDTO, FrontendChatIterationRequest } from '../types';
import { apiService } from '../utils/apiService';
import { contentCast } from '../utils';

interface MessageState {
    iterations: FrontendChatIteration[]; // Each iteration: user + multiple request responses
    isLoading: boolean;
    loadMessages: (chatId: string) => Promise<void>;
    startNewIteration: (userMessage: string) => void; // Called immediately when user sends
    addRequestMessage: (message: ChatStreamMessage) => void; // For InitStream / PrepareMessage
    updateLastRequestContent: (message: ChatStreamMessage) => void; // For StreamMessage
    clearMessages: () => void;
}

export const useMessageStore = create<MessageState>((set) => {

    function appendContent(message: ChatStreamMessage, content: MessageModalType): MessageModalType {
        if (message.content) {
            if (contentCast.isText(message, content)) {
                const contentString = message.content as string;
                return contentString + content;
            }
            else if (contentCast.isReflection(message, content)) {
                const contentReflection = message.content as MessageReflectionModal;
                return {
                    content: contentReflection.content + content.content
                };
            }
            else if (contentCast.isMemory(message, content)) {
                const current = message.content as MessageMemoryModal;
                const incoming = content as MessageMemoryModal;
                return {
                    ...current,
                    title: (current.title || '') + (incoming.title || ''),
                    explanation: (current.explanation || '') + (incoming.explanation || ''),
                    status: incoming.status ?? current.status,
                    memories: (incoming.memories && incoming.memories.length > 0) ? incoming.memories : current.memories,
                    error: incoming.error ?? current.error
                } as MessageMemoryModal;
            }
        }
        return content;
    }

    return {
        iterations: [],
        isLoading: false,

        loadMessages: async (chatId: string) => {
            set({ isLoading: true });
            try {
                const iterationsDTO: ChatIterationDTO[] = await apiService.message.fetch(chatId);
                const iterations: FrontendChatIteration[] = iterationsDTO.map(it => ({
                    userMessage: it.userMessage,
                    requests: it.requests.map(r => ({
                        modal: r.modal as any, // adapt to ChatStreamMessage modal
                        content: r.content,
                        isExpanded: r.modal === 'reflection' || r.modal === 'memory_search'
                    }))
                }));
                set({ iterations, isLoading: false });
            } catch (error) {
                set({ isLoading: false });
                throw error;
            }
        },

        startNewIteration: (userMessage: string) => {
            set(state => ({
                iterations: [...state.iterations, { userMessage, requests: [] }]
            }));
        },

        addRequestMessage: (message: ChatStreamMessage) => {
            set(state => {
                if (state.iterations.length === 0) return state; // safety
                const iterations = [...state.iterations];
                const current = iterations[iterations.length - 1];
                const request: FrontendChatIterationRequest = { ...message };
                current.requests.push(request);
                return { iterations };
            });
        },

        updateLastRequestContent: (message: ChatStreamMessage) => {
            set(state => {
                if (state.iterations.length === 0) return state;
                const iterations = [...state.iterations];
                const current = iterations[iterations.length - 1];
                const lastReq = current.requests[current.requests.length - 1];
                if (lastReq) {
                    if (lastReq.inPrepare && message.content) {
                        lastReq.content = message.content;
                        lastReq.inPrepare = false;
                        lastReq.isExpanded = lastReq.modal === 'reflection' || lastReq.modal === 'memory_search';
                    } else if (message.content) {
                        lastReq.content = appendContent(lastReq, message.content);
                    }
                }
                return { iterations };
            });
        },

        clearMessages: () => {
            set({ iterations: [] });
        },
    };
});
