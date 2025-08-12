import React from 'react';

interface ReplyMessageProps {
    content: string;
}

export const ReplyMessage: React.FC<ReplyMessageProps> = ({ content }) => {
    return (
        <div className="bubble assistant-bubble" data-testid="assistant-reply">
            {content}
        </div>
    );
};