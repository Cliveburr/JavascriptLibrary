import React from 'react';

interface UserMessageProps {
    content: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ content }) => {
    return (
        <div className="chat-message chat-message--user" data-testid="user-message">
            <div className="chat-message__content">
                <div className="chat-bubble chat-bubble--user">{content}</div>
            </div>
        </div>
    );
};