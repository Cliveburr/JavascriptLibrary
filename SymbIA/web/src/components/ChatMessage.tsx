import React from 'react';
import type { MessageDTO } from '@symbia/interfaces';
import './ChatMessage.scss';

interface ChatMessageProps {
    message: MessageDTO;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
        <div
            className={`chat-message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'}`}
            data-testid="message"
            data-role={message.role}
        >
            <div className="message-content">
                <div className="message-text">
                    {message.content}
                </div>
                <div className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};
