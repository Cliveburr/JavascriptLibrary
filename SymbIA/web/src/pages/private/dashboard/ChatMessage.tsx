import React from 'react';
import './ChatMessage.scss';
import { ChatStreamMessage } from '../../../types';
import { contentCast } from '../../../utils';

interface ChatMessageProps {
    message: ChatStreamMessage;
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
