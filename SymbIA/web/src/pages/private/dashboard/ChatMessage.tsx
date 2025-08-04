import React from 'react';
import './ChatMessage.scss';
import { FrontendMessage } from '../../../types/chat-frontend-types';

interface ChatMessageProps {
    message: FrontendMessage;
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
                </div>
            </div>
        </div>
    );
};
