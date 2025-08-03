import React from 'react';
import type { FrontendMessage } from '../../../types/frontend';
import type { StreamingMessage } from '../../../types/streaming';
import './ChatMessage.scss';

interface ChatMessageProps {
    message: FrontendMessage | StreamingMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';
    const isStreaming = 'isStreaming' in message && message.isStreaming;
    const isError = 'isError' in message && message.isError;

    return (
        <div
            className={`chat-message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'} ${isStreaming ? 'streaming' : ''} ${isError ? 'error' : ''}`}
            data-testid="message"
            data-role={message.role}
        >
            <div className="message-content">
                <div className="message-text">
                    {message.content}
                    {isStreaming && !isError && (
                        <span className="streaming-cursor">|</span>
                    )}
                </div>
                <div className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                    {isStreaming && !isError && (
                        <span className="streaming-indicator">⚡</span>
                    )}
                    {isError && (
                        <span className="error-indicator">❌</span>
                    )}
                </div>
            </div>
        </div>
    );
};
