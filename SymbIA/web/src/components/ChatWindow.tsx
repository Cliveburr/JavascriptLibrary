import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '../stores/chat.store';
import type { MessageDTO } from '@symbia/interfaces';
import type { StreamingMessage } from '../types/streaming';
import './ChatWindow.scss';

interface ChatWindowProps {
    chatId: string | null;
    messages: (MessageDTO | StreamingMessage)[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const { isLoading, isLoadingMessages, isStreaming } = useChatStore();
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
                {messages.length === 0 && !isAnyLoading && !isStreaming && (
                    <div className="empty-state">
                        <div className="empty-icon">💭</div>
                        <h4>Inicie uma conversa</h4>
                        <p>Envie uma mensagem para começar a conversar com seu assistente IA.</p>
                    </div>
                )}

                {messages.map((message: MessageDTO | StreamingMessage) => (
                    <ChatMessage
                        key={message.id}
                        message={message}
                    />
                ))}

                {(isAnyLoading || isStreaming) && (
                    <div className="typing-indicator" data-testid="typing-indicator">
                        <div className="typing-content">
                            <div className="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                            <div className="typing-text">
                                {isStreaming ? 'IA está respondendo...' : 'IA está pensando...'}
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
