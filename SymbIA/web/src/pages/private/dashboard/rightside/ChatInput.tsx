import { useState, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import type { KeyboardEvent } from 'react';
import { useChatStore } from '../../../../stores/chat.store';
import { useChatStreaming } from '../../../../hooks/useChatStreaming';
import './ChatInput.scss';
import { useNotification } from '../../../../hooks/useNotification';

interface ChatInputProps {
    horizontal?: boolean;
}

interface ChatInputRef {
    focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({ horizontal }, ref) => {
    const [message, setMessage] = useState('');
    const { isLoading, selectedChatId } = useChatStore();
    const { isStreaming, sendMessage, pauseStream } = useChatStreaming();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { error } = useNotification();

    const isNewChat = selectedChatId!!;

    // Expor função de foco para o componente pai
    useImperativeHandle(ref, () => ({
        focus: () => {
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        }
    }), []);

    const handleSubmit = useCallback(async () => {
        if (!message.trim() || isLoading || isStreaming) return;
        const messageToSend = message.trim();

        try {
            await sendMessage(messageToSend);
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.focus();
            }
        } catch (err) {
            error('Failed to send message! ' + error.toString());
            setMessage(messageToSend);
        }
    }, [message, isLoading, isStreaming, sendMessage, error]);

    const handleButtonClick = useCallback(async () => {
        if (isStreaming) {
            pauseStream();
        } else {
            await handleSubmit();
        }
    }, [isStreaming, pauseStream, handleSubmit]);

    const handleKeyPress = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    // Determinar o estado do botão
    const buttonState = useMemo(() => {
        if (isLoading || isStreaming) return 'processing';
        if (message.trim()) return 'send';
        return 'disabled';
    }, [isLoading, isStreaming, message]);

    const renderButtonIcon = useCallback(() => {
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
    }, [buttonState]);

    return (
        <div className={`chat-input${horizontal ? ' horizontal' : ''}`}>
            <div className="input-container">
                <textarea
                    ref={textareaRef}
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
                    onClick={handleButtonClick}
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
});

ChatInput.displayName = 'ChatInput';

export type { ChatInputRef };
