import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '../stores/chat.store';
import type { MessageDTO } from '@symbia/interfaces';
import './ChatWindow.scss';

interface ChatWindowProps {
    chatId: string;
    messages: MessageDTO[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const { isLoading, isLoadingMessages } = useChatStore();
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

    const isAnyLoading = isLoading || isLoadingMessages;

    return (
        <div className="chat-window">
            <div
                className="messages-container"
                ref={scrollContainerRef}
                data-testid="messages-container"
            >
                {messages.length === 0 && !isAnyLoading && (
                    <div className="empty-state">
                        <div className="empty-icon">💭</div>
                        <h4>Inicie uma conversa</h4>
                        <p>Envie uma mensagem para começar a conversar com seu assistente IA.</p>
                    </div>
                )}

                {messages.map((message: MessageDTO) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {isAnyLoading && (
                    <div className="typing-indicator" data-testid="typing-indicator">
                        <div className="typing-content">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="typing-text">IA está pensando...</div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
