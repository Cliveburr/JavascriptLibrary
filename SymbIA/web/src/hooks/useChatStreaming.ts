import { useCallback } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useMessageStore } from '../stores/message.store';
import { useStreamingStore } from '../stores/streaming.store';
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
    ChatCompletedMessage
} from '../types/chat-frontend-types';
import { useLLMStore, useMemoryStore } from '../stores';
import { MessageType } from '../types/chat-frontend-types';

export const useChatStreaming = () => {
    const { initNewChat, appendChatTitle } = useChatStore();
    const { selectedMemoryId } = useMemoryStore();
    const { selectedSetId } = useLLMStore();
    const { addMessage, streamTextMessage, updateMessage, clearMessages } = useMessageStore();

    // Usar a store centralizada ao invés do estado local
    const {
        isStreaming,
        isPaused,
        prepared,
        setStreaming,
        setPaused,
        setPrepared,
        getState
    } = useStreamingStore();

    const sendMessage = useCallback(async (content: string) => {
        const currentSelectedChatId = useChatStore.getState().selectedChatId;

        if (!content || content.trim().length === 0) {
            return;
        }

        if (!selectedSetId) {
            throw new Error('LLM Set ID is required');
        }

        setStreaming(true);
        setPaused(false);

        try {
            const response = await apiService.message.send(selectedMemoryId!, {
                chatId: typeof currentSelectedChatId === 'string' ? currentSelectedChatId : undefined,
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
            setStreaming(false);
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
                clearMessages();
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
                setPrepared({
                    role: message.role,
                    modal: message.modal
                });
            }
            else if (isStreamText(message)) {
                const streamState = getState();
                if (streamState.prepared) {
                    addMessage({
                        id: 'steaming',
                        role: streamState.prepared.role,
                        content: message.content,
                        modal: streamState.prepared.modal
                    });
                    setPrepared(undefined);
                }
                else {
                    streamTextMessage(message.content);
                }
            }
            else if (isCompleteStreamText(message)) {
                updateMessage(message.id);
            }
            else if (isCompleted(message)) {
                setStreaming(false);
            }
            else {
                throw 'Unknown message type: ' + (message as any).type;
            }
        }
    }, [addMessage, streamTextMessage, initNewChat, appendChatTitle, getState, clearMessages, selectedMemoryId, selectedSetId, updateMessage, setPrepared, setStreaming, setPaused]);

    const pauseStream = useCallback(() => {
        setPaused(true);
    }, [setPaused]);

    const resumeStream = useCallback(() => {
        setPaused(false);
    }, [setPaused]);

    return {
        isStreaming,
        isPaused,
        prepared,
        sendMessage,
        pauseStream,
        resumeStream
    };
};
