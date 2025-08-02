import { useState, useCallback, useRef } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import { MessageType } from '../types/frontend';
import { createApiUrl } from '../config/api';
import { validateObjectId } from '../utils/objectId';
import type {
    FrontendChat,
    MessageFormat
} from '../types/frontend';

interface StreamingState {
    isStreaming: boolean;
    isPaused: boolean;
    currentAssistantMessage: string;
    currentAssistantMessageId: string | null;
    currentChatTitle: string;
    isShowingThinking: boolean;
}

export const useNewChatStreaming = () => {
    const { token } = useAuthStore();
    const { addMessage, updateMessage, selectChat, addChatToMemory, updateChatTitle } = useChatStore();

    const [streamingState, setStreamingState] = useState<StreamingState>({
        isStreaming: false,
        isPaused: false,
        currentAssistantMessage: '',
        currentAssistantMessageId: null,
        currentChatTitle: '',
        isShowingThinking: false
    });

    // Ref para manter o estado atual acessível nos callbacks
    const streamingStateRef = useRef(streamingState);
    streamingStateRef.current = streamingState;

    const sendMessage = useCallback(async (memoryId: string, chatId: string | null, content: string, llmSetId: string) => {
        if (!token) {
            throw new Error('Not authenticated');
        }

        // Validar content primeiro (validação rápida)
        if (!content || content.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }

        // Validar llmSetId (validação rápida)
        if (!llmSetId) {
            throw new Error('LLM Set ID is required');
        }

        // Mudar para estado de streaming IMEDIATAMENTE após validações básicas
        setStreamingState(prev => ({
            ...prev,
            isStreaming: true,
            isPaused: false,
            currentAssistantMessage: '',
            currentAssistantMessageId: null,
            currentChatTitle: '',
            isShowingThinking: false
        }));

        // Validar memoryId (pode ser mais lenta devido ao regex)
        try {
            validateObjectId(memoryId, 'memoryId');
        } catch (error) {
            // Se validação falhar, resetar streaming
            setStreamingState(prev => ({ ...prev, isStreaming: false }));
            throw new Error(`Invalid memoryId: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        console.log('Sending message with params:', { memoryId, chatId, content, llmSetId });

        let actualChatId = chatId;
        let isNewChat = !chatId;

        try {
            const url = createApiUrl(`/chats/${memoryId}/messages`);
            console.log('Making request to:', url);

            const body = {
                content,
                llmSetId,
                chatId: actualChatId || undefined
            };
            console.log('Request body:', body);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', [...response.headers.entries()]);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error text:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            if (!response.body) {
                throw new Error('No response body');
            }

            console.log('Starting to read stream...');
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                console.log('Stream read:', { done, valueLength: value?.length });

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                console.log('Buffer content:', buffer);
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        console.log('Processing line:', line);
                        try {
                            const message: MessageFormat = JSON.parse(line);
                            console.log('Parsed message:', message);
                            await handleMessage(message, memoryId, actualChatId, isNewChat);
                        } catch (e) {
                            console.warn('Failed to parse streaming line:', line, e);
                        }
                    }
                }
            }

            // Process remaining buffer
            if (buffer.trim()) {
                console.log('Processing final buffer:', buffer);
                try {
                    const message: MessageFormat = JSON.parse(buffer);
                    console.log('Parsed final message:', message);
                    await handleMessage(message, memoryId, actualChatId, isNewChat);
                } catch (e) {
                    console.warn('Failed to parse final buffer:', buffer, e);
                }
            }

        } catch (error) {
            setStreamingState(prev => ({ ...prev, isStreaming: false }));
            throw error;
        }

        async function handleMessage(message: MessageFormat, memoryId: string, _chatId: string | null, isNew: boolean) {
            console.log('HandleMessage called with:', { message, memoryId, isNew, actualChatId });
            switch (message.type) {
                case MessageType.User:
                    console.log('Processing MessageType.User');
                    // Se é um chat novo, usar o chatId da mensagem e selecionar o chat
                    if (isNew && 'chatId' in message && message.chatId) {
                        actualChatId = message.chatId;
                        isNewChat = false;
                        console.log('Selecting new chat:', actualChatId);
                        selectChat(actualChatId);
                    }

                    // Para chat novo, apenas mudar para modo mensagem sem adicionar texto extra
                    // A mensagem do usuário será exibida normalmente do lado direito
                    if (actualChatId && 'content' in message) {
                        console.log('Adding user message to chat');
                        console.log('ChatId:', actualChatId);
                        console.log('Message content:', message.content);
                        addMessage(actualChatId, {
                            id: `user-${Date.now()}`,
                            chatId: actualChatId,
                            role: 'user',
                            content: message.content,
                            contentType: 'text',
                            createdAt: new Date().toISOString()
                        });
                        console.log('User message added to store');
                    }
                    break;

                case MessageType.StartTitle:
                    console.log('Processing MessageType.StartTitle');
                    // Sinaliza início do envio do título do chat - manter comportamento atual
                    if ('content' in message) {
                        setStreamingState(prev => ({
                            ...prev,
                            currentChatTitle: message.content
                        }));
                    }
                    break;

                case MessageType.ChunkTitle:
                    console.log('Processing MessageType.ChunkTitle');
                    // Chunk do título atual - apenas adicionar ao título e atualizar
                    if ('content' in message) {
                        setStreamingState(prev => ({
                            ...prev,
                            currentChatTitle: prev.currentChatTitle + message.content
                        }));
                    }
                    break;

                case MessageType.Thinking:
                    console.log('Processing MessageType.Thinking');
                    // Mostrar mensagem temporária que será substituída pela próxima mensagem
                    if (actualChatId) {
                        const thinkingId = `thinking-${Date.now()}`;
                        console.log('Adding thinking message with ID:', thinkingId);
                        setStreamingState(prev => ({
                            ...prev,
                            isShowingThinking: true,
                            currentAssistantMessageId: thinkingId
                        }));

                        addMessage(actualChatId, {
                            id: thinkingId,
                            chatId: actualChatId,
                            role: 'assistant',
                            content: '💭 Pensando...',
                            contentType: 'text',
                            createdAt: new Date().toISOString(),
                            isStreaming: true
                        });
                        console.log('Thinking message added to store');
                    }
                    break;

                case MessageType.StartText:
                    console.log('Processing MessageType.StartText');
                    // Recebe a estrutura da mensagem do assistant e inicia o streaming
                    if (actualChatId && 'content' in message) {
                        // O content aqui é o objeto Message completo do backend
                        const assistantMessage = message.content as any; // Estrutura da mensagem do backend
                        const assistantId = `assistant-${Date.now()}`;
                        const currentState = streamingStateRef.current;

                        // Se há uma mensagem de pensamento sendo exibida, substituir por completo
                        if (currentState.isShowingThinking && currentState.currentAssistantMessageId) {
                            // Substituir completamente a mensagem de pensamento pelo texto do assistant
                            updateMessage(actualChatId, currentState.currentAssistantMessageId, {
                                id: assistantId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: assistantMessage.content || '', // Conteúdo inicial (pode estar vazio)
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true // Ainda está em streaming
                            });
                        } else {
                            // Não há pensamento sendo exibido, adicionar nova mensagem normalmente
                            addMessage(actualChatId, {
                                id: assistantId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: assistantMessage.content || '', // Conteúdo inicial (pode estar vazio)
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true // Ainda está em streaming
                            });
                        }

                        setStreamingState(prev => ({
                            ...prev,
                            currentAssistantMessage: assistantMessage.content || '',
                            currentAssistantMessageId: assistantId,
                            isShowingThinking: false
                        }));
                    }
                    break;

                case MessageType.ChunkText:
                    console.log('Processing MessageType.ChunkText with content:', message.content);
                    // Chunk do texto do assistant - apenas adicionar ao conteúdo atual
                    if (actualChatId && 'content' in message) {
                        const currentState = streamingStateRef.current;

                        if (currentState.currentAssistantMessageId) {
                            const newContent = currentState.currentAssistantMessage + message.content;
                            console.log('Updating message content. New length:', newContent.length);

                            // Atualizar mensagem no store
                            updateMessage(actualChatId, currentState.currentAssistantMessageId, {
                                id: currentState.currentAssistantMessageId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: newContent,
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true
                            });

                            // Atualizar estado local
                            setStreamingState(prev => ({
                                ...prev,
                                currentAssistantMessage: newContent
                            }));

                            console.log('ChunkText processed successfully');
                        } else {
                            console.warn('ChunkText received but no currentAssistantMessageId');
                        }
                    }
                    break;

                case MessageType.EndText:
                    console.log('Processing MessageType.EndText');
                    // Fim da mensagem do assistant
                    if (actualChatId) {
                        const currentState = streamingStateRef.current;
                        if (currentState.currentAssistantMessageId) {
                            updateMessage(actualChatId, currentState.currentAssistantMessageId, {
                                id: currentState.currentAssistantMessageId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: currentState.currentAssistantMessage,
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: false
                            });
                        }
                    }
                    break;

                case MessageType.Completed:
                    console.log('Processing MessageType.Completed');
                    // Sinaliza final da iteração
                    const currentState = streamingStateRef.current;
                    if (isNew && actualChatId && currentState.currentChatTitle) {
                        updateChatTitle(actualChatId, currentState.currentChatTitle);
                        addChatToMemory(memoryId, {
                            id: actualChatId,
                            memoryId,
                            title: currentState.currentChatTitle,
                            orderIndex: 0,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        } as FrontendChat);
                    }

                    setStreamingState(prev => ({
                        ...prev,
                        isStreaming: false,
                        currentAssistantMessage: '',
                        currentAssistantMessageId: null,
                        currentChatTitle: '',
                        isShowingThinking: false
                    }));
                    break;

                default:
                    console.log('Unknown message type:', (message as any).type);
                    break;
            }
        }
    }, [token, addMessage, updateMessage, selectChat, addChatToMemory, updateChatTitle, streamingState]);

    const pauseStream = useCallback(() => {
        setStreamingState(prev => ({ ...prev, isPaused: true }));
    }, []);

    const resumeStream = useCallback(() => {
        setStreamingState(prev => ({ ...prev, isPaused: false }));
    }, []);

    return {
        ...streamingState,
        sendMessage,
        pauseStream,
        resumeStream
    };
};
