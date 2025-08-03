import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FrontendMessage, FrontendChat } from '../types/frontend';
import type { StreamingMessage } from '../types/streaming';
import { useApi } from '../hooks/useApi';

interface ChatState {
    // Chats organizados por memória
    chatsByMemory: Record<string, FrontendChat[]>;
    // Mensagens organizadas por chat (inclui streaming)
    messagesByChat: Record<string, (FrontendMessage | StreamingMessage)[]>;
    // Chat atualmente selecionado
    selectedChatId: string | null;
    // Último chat selecionado (persistido)
    lastSelectedChatId: string | null;
    // Chat sendo usado para streaming (pode ser diferente do selectedChatId)
    streamingChatId: string | null;
    // Estados de loading
    isLoading: boolean;
    isLoadingChats: boolean;
    isLoadingMessages: boolean;
    // Estados de streaming
    isStreaming: boolean;
    currentStreamingMessageId: string | null;
    error: string | null;

    // Actions para chats
    loadChatsByMemory: (memoryId: string) => Promise<void>;
    createChat: (memoryId: string, title?: string) => Promise<FrontendChat>;
    deleteChat: (chatId: string) => Promise<void>;
    selectChat: (chatId: string | null) => void;
    updateChatTitle: (chatId: string, title: string) => Promise<void>;
    updateChatOrder: (chatId: string, newOrderIndex: number) => Promise<void>;
    setLastSelectedChat: (chatId: string | null) => void;

    // Actions para mensagens
    loadMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, content: string, llmSetId?: string) => Promise<void>;
    sendStreamingMessage: (memoryId: string, chatId: string | null, content: string, llmSetId: string) => Promise<void>;
    addStreamingMessage: (chatId: string, message: StreamingMessage) => void;
    updateStreamingMessage: (chatId: string, message: StreamingMessage) => void;
    replaceStreamingMessage: (chatId: string, streamingId: string, finalMessage: FrontendMessage) => void;
    clearMessages: (chatId?: string) => void;

    // New methods for updated streaming
    addMessage: (chatId: string, message: FrontendMessage | StreamingMessage) => void;
    updateMessage: (chatId: string, messageId: string, message: FrontendMessage | StreamingMessage) => void;
    addChatToMemory: (memoryId: string, chat: FrontendChat) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => {
            const api = useApi();

            return {
                chatsByMemory: {},
                messagesByChat: {},
                selectedChatId: null,
                lastSelectedChatId: null,
                streamingChatId: null,
                isLoading: false,
                isLoadingChats: false,
                isLoadingMessages: false,
                isStreaming: false,
                currentStreamingMessageId: null,
                error: null,

                loadChatsByMemory: async (memoryId: string) => {
                    try {
                        set({ isLoadingChats: true, error: null });
                        const chats = await api.chat.fetchByMemory(memoryId);
                        set(state => ({
                            chatsByMemory: {
                                ...state.chatsByMemory,
                                [memoryId]: chats
                            },
                            isLoadingChats: false
                        }));
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Failed to load chats',
                            isLoadingChats: false
                        });
                    }
                },

                createChat: async (memoryId: string, title = 'Novo Chat') => {
                    try {
                        set({ isLoading: true, error: null });
                        const newChat = await api.chat.create({ memoryId, title });
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
                        set({
                            error: error instanceof Error ? error.message : 'Failed to create chat',
                            isLoading: false
                        });
                        throw error;
                    }
                },

                deleteChat: async (chatId: string) => {
                    try {
                        set({ isLoading: true, error: null });
                        await api.chat.delete(chatId);
                        set(state => {
                            const newChatsByMemory = { ...state.chatsByMemory };
                            const newMessagesByChat = { ...state.messagesByChat };

                            Object.keys(newChatsByMemory).forEach(memoryId => {
                                const chats = newChatsByMemory[memoryId];
                                if (chats) {
                                    newChatsByMemory[memoryId] = chats.filter(
                                        chat => chat.id !== chatId
                                    );
                                }
                            });

                            delete newMessagesByChat[chatId];

                            return {
                                chatsByMemory: newChatsByMemory,
                                messagesByChat: newMessagesByChat,
                                selectedChatId: state.selectedChatId === chatId ? null : state.selectedChatId,
                                isLoading: false
                            };
                        });
                    } catch (error) {
                        console.error('Erro ao deletar chat:', error);
                        set({
                            error: error instanceof Error ? error.message : 'Failed to delete chat',
                            isLoading: false
                        });
                        throw error;
                    }
                },

                selectChat: (chatId: string | null) => {
                    console.log('Store selectChat called:', { chatId });
                    set({ selectedChatId: chatId });

                    if (chatId) {
                        const state = get();
                        const hasMessages = state.messagesByChat[chatId]?.length > 0;
                        const isCurrentlyStreaming = state.isStreaming && state.streamingChatId === chatId;

                        if (!hasMessages && !isCurrentlyStreaming) {
                            console.log('Loading messages for chat:', chatId);
                            get().loadMessages(chatId);
                        } else {
                            console.log('selectChat: skipping loadMessages', {
                                hasMessages,
                                isCurrentlyStreaming,
                                messagesCount: state.messagesByChat[chatId]?.length || 0
                            });
                        }
                    }
                },

                loadMessages: async (chatId: string) => {
                    try {
                        set({ isLoadingMessages: true, error: null });
                        const messages = await api.message.fetch(chatId);
                        set(state => ({
                            messagesByChat: {
                                ...state.messagesByChat,
                                [chatId]: messages
                            },
                            isLoadingMessages: false
                        }));
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Failed to load messages',
                            isLoadingMessages: false
                        });
                    }
                },

                sendMessage: async (chatId: string, content: string, llmSetId?: string) => {
                    try {
                        set({ isLoading: true, error: null });

                        const state = get();
                        let memoryId: string | null = null;

                        for (const [mId, chats] of Object.entries(state.chatsByMemory)) {
                            if (chats.some(chat => chat.id === chatId)) {
                                memoryId = mId;
                                break;
                            }
                        }

                        if (!memoryId) {
                            throw new Error('Memory ID not found for this chat');
                        }

                        if (!llmSetId) {
                            throw new Error('LLM Set ID is required');
                        }

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

                        const response = await api.message.send(memoryId, { content, llmSetId });

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
                                },
                                isLoading: false
                            };
                        });

                    } catch (error) {
                        console.error('Error sending message:', error);
                        set({
                            isLoading: false,
                            error: error instanceof Error ? error.message : 'Failed to send message'
                        });
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
                            },
                            error: null
                        }));
                    } else {
                        console.log('Clearing ALL messages from store');
                        set({ messagesByChat: {}, error: null });
                    }
                },

                updateChatTitle: async (chatId: string, title: string) => {
                    try {
                        set({ isLoading: true, error: null });
                        const updatedChat = await api.chat.updateTitle(chatId, { title });
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
                        set({
                            error: error instanceof Error ? error.message : 'Failed to update chat title',
                            isLoading: false
                        });
                    }
                },

                updateChatOrder: async (chatId: string, newOrderIndex: number) => {
                    try {
                        set({ isLoading: true, error: null });
                        await api.chat.updateOrder(chatId, { orderIndex: newOrderIndex });

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
                        set({
                            error: error instanceof Error ? error.message : 'Failed to update chat order',
                            isLoading: false
                        });
                    }
                },

                // Implementação simplificada para streaming (a implementação completa pode ser adicionada depois)
                sendStreamingMessage: async (memoryId: string, chatId: string | null, content: string, llmSetId: string) => {
                    console.log('sendStreamingMessage called:', { memoryId, chatId, content, llmSetId });
                    set({ error: 'Streaming not yet implemented with new API hook' });
                },

                addStreamingMessage: (chatId: string, message: StreamingMessage) => {
                    set(state => ({
                        messagesByChat: {
                            ...state.messagesByChat,
                            [chatId]: [...(state.messagesByChat[chatId] || []), message]
                        },
                        currentStreamingMessageId: message.id
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
                                currentStreamingMessageId: null
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
