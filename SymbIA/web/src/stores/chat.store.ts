import { create } from 'zustand';
import type { FrontendMessage, FrontendChat } from '../types/frontend';
import type { StreamingMessage, MessageProgress } from '../types/streaming';
import { useAuthStore } from './auth.store';
import { createApiUrl } from '../config/api';

// Helper para chamadas à API
const getAuthToken = () => {
    const authState = useAuthStore.getState();
    return authState.token;
};

const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
    }

    // Handle empty responses (like 204 No Content)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return null;
    }

    return response.json();
};

interface ChatState {
    // Chats organizados por memória
    chatsByMemory: Record<string, FrontendChat[]>;
    // Mensagens organizadas por chat (inclui streaming)
    messagesByChat: Record<string, (FrontendMessage | StreamingMessage)[]>;
    // Chat atualmente selecionado
    selectedChatId: string | null;
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

export const useChatStore = create<ChatState>((set, get) => ({
    chatsByMemory: {},
    messagesByChat: {},
    selectedChatId: null,
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

            const chats = await apiCall(createApiUrl(`/chats?memoryId=${memoryId}`));

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

            const newChat = await apiCall(createApiUrl('/chats'), {
                method: 'POST',
                body: JSON.stringify({ memoryId, title }),
            });

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

            await apiCall(createApiUrl(`/chats/${chatId}`), {
                method: 'DELETE',
            });

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
            throw error; // Re-throw para que o componente saiba que houve erro
        }
    },

    selectChat: (chatId: string | null) => {
        console.log('Store selectChat called:', { chatId });
        set({ selectedChatId: chatId });

        // Carregar mensagens apenas se:
        // 1. Temos um chatId válido
        // 2. Não estamos em streaming (para evitar sobrescrever mensagens em tempo real)
        // 3. As mensagens ainda não foram carregadas para este chat
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
    }, loadMessages: async (chatId: string) => {
        try {
            set({ isLoadingMessages: true, error: null });

            // Chama API real para carregar mensagens do chat
            const messages = await apiCall(createApiUrl(`/chats/${chatId}/messages`));

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

            // Precisamos obter o memoryId do chat
            const state = get();
            let memoryId: string | null = null;

            // Busca memoryId nas estruturas existentes
            for (const [mId, chats] of Object.entries(state.chatsByMemory)) {
                if (chats.some(chat => chat.id === chatId)) {
                    memoryId = mId;
                    break;
                }
            }

            if (!memoryId) {
                throw new Error('Memory ID not found for this chat');
            }

            // Verifica se llmSetId foi fornecido
            if (!llmSetId) {
                throw new Error('LLM Set ID is required');
            }

            // Adiciona mensagem do usuário imediatamente
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

            // Chama a API real do thought-cycle
            const response = await apiCall(createApiUrl(`/chats/${memoryId}/messages`), {
                method: 'POST',
                body: JSON.stringify({ content, llmSetId }),
            });

            // Substitui mensagem temporária com as mensagens reais da API
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
            throw error; // Re-throw para que o componente possa tratar
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
            const updatedChat = await apiCall(createApiUrl(`/chats/${chatId}/title`), {
                method: 'PATCH',
                body: JSON.stringify({ title }),
            });
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
            await apiCall(createApiUrl(`/chats/${chatId}/order`), {
                method: 'PATCH',
                body: JSON.stringify({ orderIndex: newOrderIndex }),
            });

            // Recarregar a lista de chats para refletir a nova ordem
            const state = get();
            let memoryId: string | null = null;

            // Encontrar o memoryId do chat
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

    // Streaming message functions
    sendStreamingMessage: async (memoryId: string, chatId: string | null, content: string, llmSetId: string) => {
        const token = getAuthToken();

        console.log('Starting sendStreamingMessage:', { memoryId, chatId, content, llmSetId });
        set({ isStreaming: true, error: null, streamingChatId: chatId });

        try {
            // Se não tem chatId, é um novo chat - o backend irá criar automaticamente
            let actualChatId = chatId;

            // Fazer chamada de streaming usando o endpoint correto do chat.controller
            const response = await fetch(createApiUrl(`/chats/${memoryId}/messages`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    content,
                    llmSetId,
                    chatId: actualChatId || undefined // undefined para novos chats
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let currentStreamingMessage: StreamingMessage | null = null;
            let isNewChat = !chatId;

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const progress: MessageProgress = JSON.parse(line);
                            await handleStreamProgress(progress);
                        } catch (e) {
                            console.warn('Failed to parse streaming line:', line, e);
                        }
                    }
                }
            }

            // Process any remaining buffer content
            if (buffer.trim()) {
                try {
                    const progress: MessageProgress = JSON.parse(buffer);
                    await handleStreamProgress(progress);
                } catch (e) {
                    console.warn('Failed to parse final buffer:', buffer, e);
                }
            }

            async function handleStreamProgress(progress: MessageProgress) {
                console.log('Handling stream progress:', progress.modal, progress.data);
                const { MessageProgressModal } = await import('../types/streaming');

                switch (progress.modal) {
                    case MessageProgressModal.Text:
                        // Mensagem do usuário - atualizar actualChatId se for novo chat
                        if (progress.data?.userMessage) {
                            console.log('Received user message:', progress.data.userMessage);
                            if (isNewChat && progress.data.userMessage.chatId) {
                                console.log('Setting actualChatId for new chat:', progress.data.userMessage.chatId);
                                actualChatId = progress.data.userMessage.chatId;
                                get().selectChat(actualChatId);
                                set({ streamingChatId: actualChatId });
                                isNewChat = false;
                            }

                            // Garantir que temos um chatId válido
                            if (actualChatId) {
                                set(state => ({
                                    messagesByChat: {
                                        ...state.messagesByChat,
                                        [actualChatId!]: [...(state.messagesByChat[actualChatId!] || []), progress.data.userMessage]
                                    }
                                }));
                            }
                        }
                        break; case MessageProgressModal.Info:
                        // Informações de progresso (thinking, completed, etc.)
                        if (progress.data?.message === 'Thinking...') {
                            // Só criar mensagem de thinking se já temos um chatId
                            if (actualChatId) {
                                currentStreamingMessage = {
                                    id: `streaming-${Date.now()}`,
                                    chatId: actualChatId,
                                    role: 'assistant',
                                    content: '💭 Pensando...',
                                    contentType: 'text',
                                    createdAt: new Date().toISOString(),
                                    isStreaming: true
                                };
                                get().updateStreamingMessage(actualChatId, currentStreamingMessage);
                            }
                        } else if (progress.data?.message === 'Completed') {
                            // Finalizar streaming
                            if (currentStreamingMessage && actualChatId) {
                                currentStreamingMessage.isStreaming = false;
                                get().updateStreamingMessage(actualChatId, { ...currentStreamingMessage });
                            }
                            set({ isStreaming: false, currentStreamingMessageId: null, streamingChatId: null });
                        }
                        break;

                    case MessageProgressModal.TextStream:
                        // Streaming de texto do assistente
                        if (progress.data?.content) {
                            // Se não temos actualChatId ainda, aguardar pela mensagem do usuário
                            if (!actualChatId) {
                                console.warn('Received TextStream before chat was created');
                                return;
                            }

                            if (!currentStreamingMessage) {
                                // Criar mensagem de streaming se não existir
                                currentStreamingMessage = {
                                    id: `streaming-${Date.now()}`,
                                    chatId: actualChatId,
                                    role: 'assistant',
                                    content: progress.data.content,
                                    contentType: 'text',
                                    createdAt: new Date().toISOString(),
                                    isStreaming: true
                                };
                                get().updateStreamingMessage(actualChatId, currentStreamingMessage);
                            } else {
                                if (currentStreamingMessage.content === '💭 Pensando...') {
                                    currentStreamingMessage.content = progress.data.content;
                                } else {
                                    currentStreamingMessage.content += progress.data.content;
                                }
                                get().updateStreamingMessage(actualChatId, { ...currentStreamingMessage });
                            }
                        }
                        break;

                    case MessageProgressModal.Error:
                        // Erro durante o processamento
                        const errorMessage = progress.data?.message || 'Erro desconhecido';
                        if (currentStreamingMessage && actualChatId) {
                            currentStreamingMessage.content = `❌ Erro: ${errorMessage}`;
                            currentStreamingMessage.isError = true;
                            currentStreamingMessage.isStreaming = false;
                            get().updateStreamingMessage(actualChatId, { ...currentStreamingMessage });
                        }
                        set({
                            error: errorMessage,
                            isStreaming: false,
                            currentStreamingMessageId: null,
                            streamingChatId: null
                        });
                        break;

                    case MessageProgressModal.UpdateTitle:
                        // Atualização do título do chat
                        if (progress.data?.chatId && progress.data?.title) {
                            // Atualizar título no chat store
                            set(state => {
                                const memoryChats = state.chatsByMemory[memoryId] || [];
                                const existingChat = memoryChats.find(chat => chat.id === progress.data.chatId);

                                if (existingChat) {
                                    // Atualizar chat existente
                                    const updatedChats = memoryChats.map(chat =>
                                        chat.id === progress.data.chatId
                                            ? { ...chat, title: progress.data.title }
                                            : chat
                                    );

                                    return {
                                        chatsByMemory: {
                                            ...state.chatsByMemory,
                                            [memoryId]: updatedChats
                                        }
                                    };
                                } else {
                                    // Adicionar novo chat ao topo da lista
                                    // Incrementar orderIndex de todos os chats existentes
                                    const updatedExistingChats = memoryChats.map(chat => ({
                                        ...chat,
                                        orderIndex: chat.orderIndex + 1
                                    }));

                                    const newChat = {
                                        id: progress.data.chatId,
                                        memoryId: memoryId,
                                        title: progress.data.title,
                                        orderIndex: 0, // Novo chat sempre no topo
                                        createdAt: new Date().toISOString(),
                                        updatedAt: new Date().toISOString()
                                    };

                                    return {
                                        chatsByMemory: {
                                            ...state.chatsByMemory,
                                            [memoryId]: [newChat, ...updatedExistingChats]
                                        }
                                    };
                                }
                            });
                        }
                        break;

                    default:
                        console.log('Unknown streaming modal:', progress.modal, progress.data);
                }
            }

        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to send streaming message',
                isStreaming: false,
                currentStreamingMessageId: null,
                streamingChatId: null
            });
        }
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
                    },
                    currentStreamingMessageId: message.id
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

    // New methods for updated streaming
    addMessage: (chatId: string, message: FrontendMessage | StreamingMessage) => {
        console.log('Store addMessage called:', { chatId, messageId: message.id, content: message.content });
        set(state => {
            const newState = {
                messagesByChat: {
                    ...state.messagesByChat,
                    [chatId]: [...(state.messagesByChat[chatId] || []), message]
                }
            };
            console.log('Store addMessage - new state:', {
                chatId,
                messagesForChat: newState.messagesByChat[chatId]?.length || 0,
                allChats: Object.keys(newState.messagesByChat)
            });
            return newState;
        });
    },

    updateMessage: (chatId: string, messageId: string, message: FrontendMessage | StreamingMessage) => {
        console.log('Store updateMessage called:', { chatId, messageId, contentLength: message.content?.length || 0 });
        set(state => {
            const messages = state.messagesByChat[chatId] || [];
            const index = messages.findIndex(m => m.id === messageId);

            if (index >= 0) {
                const newMessages = [...messages];
                newMessages[index] = message;
                const newState = {
                    messagesByChat: {
                        ...state.messagesByChat,
                        [chatId]: newMessages
                    }
                };
                console.log('Store updateMessage - updated state:', {
                    chatId,
                    messagesForChat: newState.messagesByChat[chatId]?.length || 0,
                    messageIndex: index,
                    updatedContent: message.content?.substring(0, 50) + '...'
                });
                return newState;
            }
            console.log('Store updateMessage - message not found, returning same state');
            return state;
        });
    }, addChatToMemory: (memoryId: string, chat: FrontendChat) => {
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
}));
