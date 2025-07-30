import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useChatStore } from '../stores/chat.store';
import './ChatInput.scss';

interface ChatInputProps {
    chatId: string | null;
    memoryId: string;
    onStartNewChat?: (firstMessage: string) => Promise<void>;
    horizontal?: boolean;
    llmSetId?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ chatId, memoryId, onStartNewChat, horizontal, llmSetId }) => {
    const [message, setMessage] = useState('');
    const { sendStreamingMessage, isLoading, isStreaming } = useChatStore();
    // Detectar se é novo chat
    const isNewChat = chatId == null;

    const handleSubmit = async () => {
        if (!message.trim() || isLoading || isStreaming) return;
        const messageToSend = message.trim();
        setMessage('');

        try {
            if (!llmSetId) {
                throw new Error('LLM Set ID is required for sending messages');
            }

            if (isNewChat && onStartNewChat) {
                await onStartNewChat(messageToSend);
            } else if (chatId) {
                // Usar nova função de streaming para chats existentes
                await sendStreamingMessage(memoryId, chatId, messageToSend, llmSetId);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            setMessage(messageToSend);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Determinar o estado do botão
    const getButtonState = () => {
        if (isLoading || isStreaming) return 'processing';
        if (message.trim()) return 'send';
        return 'disabled';
    };

    const buttonState = getButtonState();

    const renderButtonIcon = () => {
        switch (buttonState) {
            case 'processing':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" className="pause-icon">
                        <path
                            d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'send':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" className="send-icon">
                        <path
                            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                            fill="currentColor"
                        />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" className="send-icon disabled">
                        <path
                            d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                            fill="currentColor"
                        />
                    </svg>
                );
        }
    };

    return (
        <div className={`chat-input${horizontal ? ' horizontal' : ''}`}>
            <div className="input-container">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isNewChat ? "Digite a primeira mensagem para iniciar o chat..." : "Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"}
                    disabled={isLoading || isStreaming}
                    rows={1}
                    className="message-input"
                    data-testid="chat-input"
                />
                <button
                    onClick={handleSubmit}
                    disabled={buttonState === 'disabled'}
                    className={`send-button ${buttonState}`}
                    type="button"
                    data-testid="send-button"
                    title={
                        buttonState === 'processing'
                            ? 'Pausar'
                            : buttonState === 'send'
                                ? (isNewChat ? 'Iniciar chat' : 'Enviar mensagem')
                                : 'Digite uma mensagem'
                    }
                >
                    {renderButtonIcon()}
                </button>
            </div>
        </div>
    );
};
