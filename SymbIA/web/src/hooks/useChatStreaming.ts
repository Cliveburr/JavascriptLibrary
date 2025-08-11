import { useCallback } from 'react';
import { useChatStore } from '../stores/chat.store';
import { useMessageStore } from '../stores/message.store';
import { useStreamingStore } from '../stores/streaming.store';
import { apiService } from '../utils/apiService';
import { useLLMStore, useMemoryStore } from '../stores';
import type { ChatStream } from '../types/chat-frontend-types';
import { ChatStreamType } from '../types/chat-frontend-types';

export const useChatStreaming = () => {
    const { initNewChat, appendChatTitle } = useChatStore();
    const { selectedMemoryId } = useMemoryStore();
    const { selectedSetId } = useLLMStore();
    const { addMessage, updateContentMessage, clearMessages } = useMessageStore();
    const { isStreaming, isPaused, setStreaming, setPaused } = useStreamingStore();

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
                            const message: ChatStream = JSON.parse(line);
                            await handleMessage(message);
                        } catch (e) {
                            console.error('Failed to parse streaming line:', line, e);
                        }
                    }
                }
            }

            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const message: ChatStream = JSON.parse(buffer);
                    await handleMessage(message);
                } catch (e) {
                    console.error('Failed to parse final buffer:', buffer, e);
                }
            }

        } catch (error) {
            setStreaming(false);
            throw error;
        }

        async function handleMessage(stream: ChatStream) {
            switch (stream.type) {
                case ChatStreamType.InitNewStream:
                    if (!stream.chat?.chatId
                        || !stream.chat?.orderIndex
                        || !stream.message) {
                        throw 'Invalid InitNewStream message!';
                    }
                    initNewChat(stream.chat.chatId, stream.chat.orderIndex);
                    clearMessages();
                    addMessage(stream.message);
                    break;
                case ChatStreamType.InitStream:
                    if (!stream.message) {
                        throw 'Invalid InitStream message!';
                    }
                    addMessage(stream.message);
                    break;
                case ChatStreamType.StreamTitle:
                    if (!stream.chat?.title) {
                        throw 'Invalid StreamTitle message!';
                    }
                    appendChatTitle(stream.chat.title);
                    break;
                case ChatStreamType.PrepareMessage:
                    if (!stream.message) {
                        throw 'Invalid PrepareMessage message!';
                    }
                    stream.message.inPrepare = true;
                    stream.message.modal = 'text';
                    stream.message.content = '💭 IA está pensando...';
                    addMessage(stream.message);
                    break;
                case ChatStreamType.StreamMessage:
                    if (!stream.message) {
                        throw 'Invalid StreamMessage message!';
                    }
                    updateContentMessage(stream.message);
                    break;
                case ChatStreamType.Completed:
                    setStreaming(false);
                    break;
                default:
                    throw 'Unknown message type: ' + stream.type;
            }


        }
    }, [initNewChat, appendChatTitle, selectedMemoryId, selectedSetId, addMessage, updateContentMessage, clearMessages, isStreaming, isPaused, setStreaming, setPaused]);

    const pauseStream = useCallback(() => {
        setPaused(true);
    }, [setPaused]);

    const resumeStream = useCallback(() => {
        setPaused(false);
    }, [setPaused]);

    return {
        isStreaming,
        isPaused,
        sendMessage,
        pauseStream,
        resumeStream
    };
};
