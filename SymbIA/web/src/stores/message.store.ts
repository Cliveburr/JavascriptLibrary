import { create } from 'zustand';
import type { ChatStreamMessage, MessageModalType, MessageReflectionModal, MessageMemoryModal } from '../types';
import { apiService } from '../utils/apiService';
import { contentCast } from '../utils';

interface MessageState {
    messages: ChatStreamMessage[];
    isLoading: boolean;
    loadMessages: (chatId: string) => Promise<void>;
    addMessage: (message: ChatStreamMessage) => void;
    updateContentMessage: (message: ChatStreamMessage) => void;
    // Removed updateIdMessage/updateMessage due to backend protocol change
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

        addMessage: (message: ChatStreamMessage) => {
            set(state => {
                return { messages: [...state.messages, message] };
            });
        },

        updateContentMessage: (message: ChatStreamMessage) => {
            set(state => {
                const newMessages = [...state.messages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage) {
                    if (lastMessage.inPrepare && message.content) {
                        const newMessage: ChatStreamMessage = {
                            modal: lastMessage.modal,
                            content: message.content,
                            inPrepare: false,
                            isExpanded: lastMessage.modal === 'reflection' || lastMessage.modal === 'memory_search'
                        };
                        newMessages[newMessages.length - 1] = newMessage;
                    } else if (message.content) {
                        newMessages[newMessages.length - 1] = {
                            ...lastMessage,
                            content: appendContent(lastMessage, message.content)
                        };
                    }
                }
                return { messages: newMessages };
            });
        },

        clearMessages: () => {
            set({ messages: [] });
        },
    };
});
