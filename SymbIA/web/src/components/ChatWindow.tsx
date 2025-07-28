import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '../stores/chat.store';
import type { MessageDTO } from '@symbia/interfaces';
import './ChatWindow.scss';

interface ChatWindowProps {
    memoryId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ memoryId }) => {
    const { messages, isLoading } = useChatStore();
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

    // Filter messages for current memory/chat
    const currentMessages = messages.filter(msg =>
        msg.chatId === `chat-${memoryId}`
    );

    return (
        <div className="chat-window">
            <div
                className="messages-container"
                ref={scrollContainerRef}
                data-testid="messages-container"
            >
                {currentMessages.length === 0 && !isLoading && (
                    <div className="empty-state">
                        <div className="empty-icon">💭</div>
                        <h4>Start a conversation</h4>
                        <p>Send a message to begin chatting with your AI assistant.</p>
                    </div>
                )}

                {currentMessages.map((message: MessageDTO) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {isLoading && (
                    <div className="typing-indicator" data-testid="typing-indicator">
                        <div className="typing-content">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="typing-text">AI is thinking...</div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
