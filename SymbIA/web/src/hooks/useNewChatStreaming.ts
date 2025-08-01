import { useState, useCallback } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useAuthStore } from '../stores/auth.store';
import { MessageType } from '../types/frontend';
import { createApiUrl } from '../config/api';
import { validateObjectId } from '../utils/objectId';
import type {
    FrontendMessage,
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

    const sendMessage = useCallback(async (memoryId: string, chatId: string | null, content: string, llmSetId: string) => {
        if (!token) {
            throw new Error('Not authenticated');
        }

        // Validar memoryId (deve ser ObjectId válido de 24 caracteres hex)
        try {
            validateObjectId(memoryId, 'memoryId');
        } catch (error) {
            throw new Error(`Invalid memoryId: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        // Validar llmSetId
        if (!llmSetId) {
            throw new Error('LLM Set ID is required');
        }

        // Validar content
        if (!content || content.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }

        console.log('Sending message with params:', { memoryId, chatId, content, llmSetId });

        setStreamingState(prev => ({
            ...prev,
            isStreaming: true,
            isPaused: false,
            currentAssistantMessage: '',
            currentAssistantMessageId: null,
            currentChatTitle: '',
            isShowingThinking: false
        }));

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

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const message: MessageFormat = JSON.parse(line);
                            await handleMessage(message, memoryId, actualChatId, isNewChat);
                        } catch (e) {
                            console.warn('Failed to parse streaming line:', line, e);
                        }
                    }
                }
            }

            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const message: MessageFormat = JSON.parse(buffer);
                    await handleMessage(message, memoryId, actualChatId, isNewChat);
                } catch (e) {
                    console.warn('Failed to parse final buffer:', buffer, e);
                }
            }

        } catch (error) {
            setStreamingState(prev => ({ ...prev, isStreaming: false }));
            throw error;
        }

        async function handleMessage(message: MessageFormat, memoryId: string, chatId: string | null, isNew: boolean) {
            switch (message.type) {
                case MessageType.User:
                    // Se é um chat novo, usar o chatId da mensagem
                    if (isNew && 'chatId' in message && message.chatId) {
                        actualChatId = message.chatId;
                        isNewChat = false;
                        selectChat(actualChatId);
                    }

                    if (actualChatId && 'content' in message) {
                        addMessage(actualChatId, {
                            id: `user-${Date.now()}`,
                            chatId: actualChatId,
                            role: 'user',
                            content: message.content,
                            contentType: 'text',
                            createdAt: new Date().toISOString()
                        });
                    }
                    break;

                case MessageType.StartTitle:
                    if ('content' in message) {
                        setStreamingState(prev => ({
                            ...prev,
                            currentChatTitle: message.content
                        }));
                    }
                    break;

                case MessageType.ChunkTitle:
                    if ('content' in message) {
                        setStreamingState(prev => ({
                            ...prev,
                            currentChatTitle: prev.currentChatTitle + message.content
                        }));
                    }
                    break;

                case MessageType.Thinking:
                    if (actualChatId) {
                        const thinkingId = `thinking-${Date.now()}`;
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
                    }
                    break;

                case MessageType.StartText:
                    if (actualChatId && 'content' in message) {
                        const assistantId = `assistant-${Date.now()}`;

                        // Remove thinking message if exists
                        if (streamingState.isShowingThinking && streamingState.currentAssistantMessageId) {
                            // Replace thinking with actual content
                            updateMessage(actualChatId, streamingState.currentAssistantMessageId, {
                                id: assistantId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: message.content,
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true
                            });
                        } else {
                            addMessage(actualChatId, {
                                id: assistantId,
                                chatId: actualChatId,
                                role: 'assistant',
                                content: message.content,
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true
                            });
                        }

                        setStreamingState(prev => ({
                            ...prev,
                            currentAssistantMessage: message.content,
                            currentAssistantMessageId: assistantId,
                            isShowingThinking: false
                        }));
                    }
                    break;

                case MessageType.ChunkText:
                    if (actualChatId && streamingState.currentAssistantMessageId && 'content' in message) {
                        const newContent = streamingState.currentAssistantMessage + message.content;

                        updateMessage(actualChatId, streamingState.currentAssistantMessageId, {
                            id: streamingState.currentAssistantMessageId,
                            chatId: actualChatId,
                            role: 'assistant',
                            content: newContent,
                            contentType: 'text',
                            createdAt: new Date().toISOString(),
                            isStreaming: true
                        });

                        setStreamingState(prev => ({
                            ...prev,
                            currentAssistantMessage: newContent
                        }));
                    }
                    break;

                case MessageType.EndText:
                    if (actualChatId && streamingState.currentAssistantMessageId) {
                        updateMessage(actualChatId, streamingState.currentAssistantMessageId, {
                            id: streamingState.currentAssistantMessageId,
                            chatId: actualChatId,
                            role: 'assistant',
                            content: streamingState.currentAssistantMessage,
                            contentType: 'text',
                            createdAt: new Date().toISOString(),
                            isStreaming: false
                        });
                    }
                    break;

                case MessageType.Completed:
                    // Update chat title if it's a new chat and we have a title
                    if (isNew && actualChatId && streamingState.currentChatTitle) {
                        updateChatTitle(actualChatId, streamingState.currentChatTitle);
                        addChatToMemory(memoryId, {
                            id: actualChatId,
                            memoryId,
                            title: streamingState.currentChatTitle,
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
