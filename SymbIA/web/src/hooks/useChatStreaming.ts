import { useState, useCallback, useRef } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useMessageStore } from '../stores/message.store';
import { apiService } from '../utils/apiService';
import type {
    MessageFormat,
    ChatInitNewStreamMessage,
    ChatInitStreamMessage,
    ChatStreamTitleMessage,
    ChatThinkingMessage,
    ChatPrepareStreamTextMessage,
    ChatStreamTextMessage,
    ChatCompleteStreamTextMessage,
    ChatCompletedMessage,
    FrontendMessageModal,
    FrontendMessageRole
} from '../types/chat-frontend-types';
import { useLLMStore, useMemoryStore } from '../stores';
import { MessageType } from '../types/chat-frontend-types';

interface PreparedForStream {
    role: FrontendMessageRole;
    modal: FrontendMessageModal;
}

interface StreamingState {
    isStreaming: boolean;
    isPaused: boolean;
    prepared?: PreparedForStream;
}

export const useChatStreaming = () => {
    const { selectedChatId, initNewChat, appendChatTitle } = useChatStore();
    const { selectedMemoryId } = useMemoryStore();
    const { selectedSetId } = useLLMStore();
    const { addMessage, streamTextMessage, updateMessage } = useMessageStore();

    const [streamingState, setStreamingState] = useState<StreamingState>({
        isStreaming: false,
        isPaused: false
    });

    // Ref para manter o estado atual acessível nos callbacks
    const streamingStateRef = useRef(streamingState);
    streamingStateRef.current = streamingState;

    const sendMessage = useCallback(async (content: string) => {
        // Validar content primeiro (validação rápida)
        if (!content || content.trim().length === 0) {
            return;
        }

        // Validar llmSetId (validação rápida)
        if (!selectedSetId) {
            throw new Error('LLM Set ID is required');
        }

        // Mudar para estado de streaming IMEDIATAMENTE após validações básicas
        setStreamingState(prev => ({
            ...prev,
            isStreaming: true,
            isPaused: false
        }));

        try {
            const response = await apiService.message.send(selectedMemoryId!, {
                chatId: typeof selectedChatId === 'string' ? selectedChatId : undefined,
                llmSetId: selectedSetId,
                content
            });

            if (!response.ok) {
                const errorText = await response.text();
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
                            await handleMessage(message);
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
                    await handleMessage(message);
                } catch (e) {
                    console.warn('Failed to parse final buffer:', buffer, e);
                }
            }

        } catch (error) {
            setStreamingState(prev => ({ ...prev, isStreaming: false }));
            throw error;
        }

        function isInitNewStream(message: MessageFormat): message is ChatInitNewStreamMessage {
            return message.type == MessageType.InitNewStream;
        }
        function isInitStream(message: MessageFormat): message is ChatInitStreamMessage {
            return message.type == MessageType.InitStream;
        }
        function isStreamTitle(message: MessageFormat): message is ChatStreamTitleMessage {
            return message.type == MessageType.StreamTitle;
        }
        function isThinking(message: MessageFormat): message is ChatThinkingMessage {
            return message.type == MessageType.Thinking;
        }
        function isPrepareStreamText(message: MessageFormat): message is ChatPrepareStreamTextMessage {
            return message.type == MessageType.PrepareStreamText;
        }
        function isStreamText(message: MessageFormat): message is ChatStreamTextMessage {
            return message.type == MessageType.StreamText;
        }
        function isCompleteStreamText(message: MessageFormat): message is ChatCompleteStreamTextMessage {
            return message.type == MessageType.CompleteStreamText;
        }
        function isCompleted(message: MessageFormat): message is ChatCompletedMessage {
            return message.type == MessageType.Completed;
        }

        async function handleMessage(message: MessageFormat) {
            if (isInitNewStream(message)) {
                initNewChat({
                    id: message.chatId,
                    title: '',
                    orderIndex: message.orderIndex
                });
                addMessage(message.userMessage);
            }
            else if (isInitStream(message)) {
                addMessage(message.userMessage);
            }
            else if (isStreamTitle(message)) {
                appendChatTitle(message.content);
            }
            else if (isThinking(message)) {
                addMessage({
                    id: 'Thinking',
                    role: 'assistant',
                    content: '💭 Pensando...',
                    modal: 'text'
                });
            }
            else if (isPrepareStreamText(message)) {
                setStreamingState(prev => ({
                    ...prev, prepared: {
                        role: message.role,
                        modal: message.modal
                    }
                }));
            }
            else if (isStreamText(message)) {
                if (streamingStateRef.current.prepared) {
                    addMessage({
                        id: 'steaming',
                        role: streamingStateRef.current.prepared.role,
                        content: message.content,
                        modal: streamingStateRef.current.prepared.modal
                    });
                    setStreamingState(prev => ({
                        ...prev, prepared: undefined
                    }));
                }
                else {
                    streamTextMessage(message.content);
                }
            }
            else if (isCompleteStreamText(message)) {
                updateMessage(message.id);
            }
            else if (isCompleted(message)) {
                setStreamingState(prev => ({
                    ...prev,
                    isStreaming: false
                }));
            }
            else {
                throw 'Unknown message type: ' + (message as any).type;
            }
        }
    }, [addMessage, streamTextMessage, initNewChat, appendChatTitle]);

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
