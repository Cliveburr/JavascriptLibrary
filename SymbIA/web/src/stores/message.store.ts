import { create } from 'zustand';
import type { FrontendMessage } from '../types/frontend';
import type { StreamingMessage } from '../types/streaming';
import { apiService } from '../utils/apiService';

interface MessageState {
    // Mensagens organizadas por chat (inclui streaming)
    messagesByChat: Record<string, (FrontendMessage | StreamingMessage)[]>;
    // Estados de loading
    isLoadingMessages: boolean;
    // Estados de streaming
    isStreaming: boolean;
    currentStreamingMessageId: string | null;
    streamingChatId: string | null;

    // Actions para mensagens
    loadMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string, llmSetId: string, memoryId: string) => Promise<void>;
    sendStreamingMessage: (memoryId: string, chatId: string | null, content: string, llmSetId: string) => Promise<void>;
    addStreamingMessage: (chatId: string, message: StreamingMessage) => void;
    updateStreamingMessage: (chatId: string, message: StreamingMessage) => void;
    replaceStreamingMessage: (chatId: string, streamingId: string, finalMessage: FrontendMessage) => void;
    clearMessages: (chatId?: string) => void;
    addMessage: (chatId: string, message: FrontendMessage | StreamingMessage) => void;
    updateMessage: (chatId: string, messageId: string, message: FrontendMessage | StreamingMessage) => void;
    removeMessagesFromChat: (chatId: string) => void;
}

export const useMessageStore = create<MessageState>((set) => {
    return {
        messagesByChat: {},
        isLoadingMessages: false,
        isStreaming: false,
        currentStreamingMessageId: null,
        streamingChatId: null,

        loadMessages: async (chatId: string) => {
            set({ isLoadingMessages: true });
            try {
                const messages = await apiService.message.fetch(chatId);
                set(state => ({
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: messages
                    },
                    isLoadingMessages: false
                }));
            } catch (error) {
                set({ isLoadingMessages: false });
                throw error;
            }
        },

        sendMessage: async (chatId: string, content: string, llmSetId: string, memoryId: string) => {
            try {
                const userMessage: FrontendMessage = {
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

                const response = await apiService.message.send(memoryId, { content, llmSetId });

                set(state => {
                    const currentMessages = state.messagesByChat[chatId] || [];
                    const messagesWithoutTemp = currentMessages.filter(m => m.id !== userMessage.id);

                    return {
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: [
                                ...messagesWithoutTemp,
                                response.userMessage,
                                response.assistantMessage
                            ]
                        }
                    };
                });

            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        },

        clearMessages: (chatId?: string) => {
            console.log('Store clearMessages called:', { chatId });
            if (chatId) {
                set(state => ({
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: []
                    }
                }));
            } else {
                console.log('Clearing ALL messages from store');
                set({ messagesByChat: {} });
            }
        },

        sendStreamingMessage: async (memoryId: string, chatId: string | null, content: string, llmSetId: string) => {
            console.log('sendStreamingMessage called:', { memoryId, chatId, content, llmSetId });
            throw new Error('Streaming not yet implemented with new API hook');
        },

        addStreamingMessage: (chatId: string, message: StreamingMessage) => {
            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: [...(state.messagesByChat[chatId] || []), message]
                },
                currentStreamingMessageId: message.id,
                streamingChatId: chatId,
                isStreaming: true
            }));
        },

        updateStreamingMessage: (chatId: string, message: StreamingMessage) => {
            set(state => {
                const messages = state.messagesByChat[chatId] || [];
                const index = messages.findIndex(m => m.id === message.id);

                if (index >= 0) {
                    const newMessages = [...messages];
                    newMessages[index] = message;
                    return {
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: newMessages
                        }
                    };
                } else {
                    return {
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: [...messages, message]
                        }
                    };
                }
            });
        },

        replaceStreamingMessage: (chatId: string, streamingId: string, finalMessage: FrontendMessage) => {
            set(state => {
                const messages = state.messagesByChat[chatId] || [];
                const index = messages.findIndex(m => m.id === streamingId);

                if (index >= 0) {
                    const newMessages = [...messages];
                    newMessages[index] = finalMessage;
                    return {
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: newMessages
                        },
                        currentStreamingMessageId: null,
                        isStreaming: false,
                        streamingChatId: null
                    };
                }
                return state;
            });
        },

        addMessage: (chatId: string, message: FrontendMessage | StreamingMessage) => {
            console.log('Store addMessage called:', { chatId, messageId: message.id, content: message.content });
            set(state => ({
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: [...(state.messagesByChat[chatId] || []), message]
                }
            }));
        },

        updateMessage: (chatId: string, messageId: string, message: FrontendMessage | StreamingMessage) => {
            set(state => {
                const messages = state.messagesByChat[chatId] || [];
                const index = messages.findIndex(m => m.id === messageId);

                if (index >= 0) {
                    const newMessages = [...messages];
                    newMessages[index] = message;
                    return {
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: newMessages
                        }
                    };
                }
                return state;
            });
        },

        removeMessagesFromChat: (chatId: string) => {
            set(state => {
                const newMessagesByChat = { ...state.messagesByChat };
                delete newMessagesByChat[chatId];
                return {
                    messagesByChat: newMessagesByChat
                };
            });
        },
    };
});
