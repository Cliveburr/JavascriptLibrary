

import React from 'react';
import './ChatMessage.scss';

interface UserMessageProps {
    content: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
    return (
        <div className="chat-message user" data-testid="user-message">
            <div className="message-content">
                <div className="bubble user-bubble">{content}</div>
            </div>
        </div>
    );
};