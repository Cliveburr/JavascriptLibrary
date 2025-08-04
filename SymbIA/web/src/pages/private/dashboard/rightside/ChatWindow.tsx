import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../ChatMessage';
import { useChatStore } from '../../../../stores/chat.store';
import { useMessageStore } from '../../../../stores/message.store';
import './ChatWindow.scss';
import { FrontendMessage } from '../../../../types/chat-frontend-types';

interface ChatWindowProps {
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ }) => {
    const { messages } = useMessageStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            });
        }
    }, [messages]);

    return (
        <div className="chat-window">
            <div
                className="messages-container"
                ref={scrollContainerRef}
                data-testid="messages-container"
            >

                {messages.map((message: FrontendMessage) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
