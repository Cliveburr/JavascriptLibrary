import { useCallback } from 'react';
import type { MessageProgress, StreamingMessage } from '../types/streaming';
import { MessageProgressModal as Modal } from '../types/streaming';
import type { MessageDTO } from '@symbia/interfaces';

interface UseStreamingProps {
    chatId: string;
    memoryId: string;
    onMessageUpdate: (message: StreamingMessage) => void;
    onUserMessage: (message: MessageDTO) => void;
    onAssistantMessage: (message: MessageDTO) => void;
    onTitleUpdate: (chatId: string, title: string) => void;
    onError: (error: string) => void;
    onStreamComplete: (latency?: string) => void;
}

export const useStreaming = ({
    chatId,
    memoryId,
    onMessageUpdate,
    onUserMessage,
    onAssistantMessage,
    onTitleUpdate,
    onError,
    onStreamComplete
}: UseStreamingProps) => {

    const sendStreamingMessage = useCallback(async (
        content: string,
        llmSetId: string,
        authToken?: string
    ) => {
        try {
            const response = await fetch(`http://localhost:3002/api/memories/${memoryId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
                },
                body: JSON.stringify({
                    content,
                    llmSetId,
                    chatId: chatId !== 'new' ? chatId : undefined
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
                switch (progress.modal) {
                    case Modal.Text:
                        // Mensagem do usuário
                        if (progress.data?.userMessage) {
                            onUserMessage(progress.data.userMessage);
                        }
                        break;

                    case Modal.Info:
                        // Informações de progresso (thinking, completed, etc.)
                        if (progress.data?.message === 'Thinking...') {
                            // Criar mensagem temporária do assistente
                            currentStreamingMessage = {
                                id: `streaming-${Date.now()}`,
                                chatId,
                                role: 'assistant',
                                content: '💭 Pensando...',
                                contentType: 'text',
                                createdAt: new Date().toISOString(),
                                isStreaming: true
                            };
                            onMessageUpdate(currentStreamingMessage);
                        } else if (progress.data?.message === 'Completed') {
                            // Finalizar streaming
                            if (currentStreamingMessage) {
                                currentStreamingMessage.isStreaming = false;
                            }
                            if (progress.data?.assistantMessage) {
                                onAssistantMessage(progress.data.assistantMessage);
                            }
                            onStreamComplete(progress.data?.latency);
                        }
                        break;

                    case Modal.TextStream:
                        // Streaming de texto do assistente
                        if (progress.data?.content && currentStreamingMessage) {
                            if (currentStreamingMessage.content === '💭 Pensando...') {
                                currentStreamingMessage.content = progress.data.content;
                            } else {
                                currentStreamingMessage.content += progress.data.content;
                            }
                            onMessageUpdate({ ...currentStreamingMessage });
                        }
                        break;

                    case Modal.Error:
                        // Erro durante o processamento
                        const errorMessage = progress.data?.message || 'Erro desconhecido';
                        if (currentStreamingMessage) {
                            currentStreamingMessage.content = `❌ Erro: ${errorMessage}`;
                            currentStreamingMessage.isError = true;
                            currentStreamingMessage.isStreaming = false;
                            onMessageUpdate({ ...currentStreamingMessage });
                        }
                        onError(errorMessage);
                        break;

                    case Modal.UpdateTitle:
                        // Atualização do título do chat
                        if (progress.data?.chatId && progress.data?.title) {
                            onTitleUpdate(progress.data.chatId, progress.data.title);
                        }
                        break;

                    default:
                        console.log('Unknown streaming modal:', progress.modal, progress.data);
                }
            }

        } catch (error) {
            console.error('Streaming error:', error);
            onError(error instanceof Error ? error.message : 'Erro de streaming');
            throw error;
        }
    }, [chatId, memoryId, onMessageUpdate, onUserMessage, onAssistantMessage, onTitleUpdate, onError, onStreamComplete]);

    return {
        sendStreamingMessage
    };
};
