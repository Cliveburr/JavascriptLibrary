import { useState, useCallback, useRef } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useMessageStore } from '../stores/message.store';
import { useAuthStore } from '../stores/auth.store';
import { MessageType } from '../types/frontend';
import { createApiUrl } from '../config/api';
import { validateObjectId } from '../utils/objectId';
import type {
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
    const { selectChat, initNewChat, appendChatTitle } = useChatStore();
    const { addMessage, appendMessage } = useMessageStore();

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
                case MessageType.Init:

                    // criar uma msg para InitStream e InitNewStream
                    // 

                    console.log('Processing MessageType.User');
                    // Se é um chat novo, inicializar o chat e usar o chatId da mensagem
                    if (isNew && 'chatId' in message && message.chatId) {
                        // Inicializar o novo chat no store
                        initNewChat(memoryId);
                        actualChatId = message.chatId;
                        isNewChat = false;
                        console.log('Initializing new chat:', actualChatId);
                        selectChat(actualChatId);
                    }

                    // Para chat novo, apenas mudar para modo mensagem sem adicionar texto extra
                    // A mensagem do usuário será exibida normalmente do lado direito
                    if (actualChatId && 'content' in message) {
                        console.log('Adding user message to chat');
                        console.log('ChatId:', actualChatId);
                        console.log('Message content:', message.content);
                        addMessage({
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

                case MessageType.StreamTitle:
                    console.log('Processing MessageType.StreamTitle');
                    // Para o primeiro StreamTitle, inicializar o título
                    if ('content' in message) {
                        const currentState = streamingStateRef.current;
                        if (!currentState.currentChatTitle) {
                            setStreamingState(prev => ({
                                ...prev,
                                currentChatTitle: message.content
                            }));
                        } else {
                            // Para os próximos, adicionar ao título
                            setStreamingState(prev => ({
                                ...prev,
                                currentChatTitle: prev.currentChatTitle + message.content
                            }));
                        }

                        // Se já temos um chatId, adicionar o conteúdo ao título do chat
                        if (actualChatId) {
                            appendChatTitle(actualChatId, message.content);
                        }
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

                        addMessage({
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

                case MessageType.StreamText:
                    console.log('Processing MessageType.StreamText with content:', message.content);
                    if (actualChatId && 'content' in message) {
                        const currentState = streamingStateRef.current;

                        // No primeiro StreamText, criar nova mensagem (substitui thinking automaticamente)
                        if (!currentState.currentAssistantMessageId || currentState.isShowingThinking) {
                            const assistantId = `assistant-${Date.now()}`;

                            // Adicionar nova mensagem (irá substituir a thinking se existir)
                            addMessage({
                                id: assistantId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: message.content,
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true
                            });

                            setStreamingState(prev => ({
                                ...prev,
                                currentAssistantMessage: message.content,
                                currentAssistantMessageId: assistantId,
                                isShowingThinking: false
                            }));
                        } else {
                            // Para os próximos chunks, anexar ao conteúdo
                            console.log('Appending to existing message:', message.content);
                            appendMessage(message.content);

                            setStreamingState(prev => ({
                                ...prev,
                                currentAssistantMessage: prev.currentAssistantMessage + message.content
                            }));
                        }
                        console.log('StreamText processed successfully');
                    }
                    break;

                case MessageType.Completed:
                    console.log('Processing MessageType.Completed');

                    // A mensagem já está finalizada via appendMessage, apenas marcar como não-streaming
                    // O chat já foi inicializado e o título já está sendo atualizado via StreamTitle

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
    }, [token, addMessage, appendMessage, selectChat, initNewChat, appendChatTitle, streamingState]);

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
