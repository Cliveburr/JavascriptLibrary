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
    updateIdMessage: (messageId: string) => void;
    updateMessage: (messageId: string, updates: Partial<ChatStreamMessage>) => void;
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
                    title: contentReflection.title + content.title,
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
                    if (lastMessage.inPrepare) {
                        const newMessage: ChatStreamMessage = {
                            messageId: lastMessage.messageId,
                            modal: lastMessage.originModal,
                            role: lastMessage.role,
                            content: message.content
                        };
                        if (newMessage.modal == 'reflection' || newMessage.modal == 'memory') {
                            newMessage.isExpanded = true;
                        }
                        newMessages[newMessages.length - 1] = newMessage;
                    }
                    else if (message.content) {
                        newMessages[newMessages.length - 1] = {
                            ...lastMessage,
                            content: appendContent(lastMessage, message.content)
                        };
                    }
                }
                return { messages: newMessages };
            });
        },

        updateIdMessage: (messageId: string) => {
            set(state => {
                const newMessages = [...state.messages];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage) {
                    const newMessage: ChatStreamMessage = {
                        ...lastMessage,
                        messageId
                    };
                    if (lastMessage.modal == 'reflection' || lastMessage.modal == 'memory') {
                        newMessage.isExpanded = false;
                    }
                    newMessages[newMessages.length - 1] = newMessage;
                }
                return { messages: newMessages };
            });
        },

        updateMessage: (messageId: string, updates: Partial<ChatStreamMessage>) => {
            set(state => {
                const newMessages = state.messages.map(message =>
                    message.messageId === messageId
                        ? { ...message, ...updates }
                        : message
                );
                return { messages: newMessages };
            });
        },

        clearMessages: () => {
            set({ messages: [] });
        },
    };
});
