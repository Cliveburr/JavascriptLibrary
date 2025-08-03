import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { useChatStore } from '../../../stores/chat.store';
import { useMessageStore } from '../../../stores/message.store';
import type { FrontendMessage } from '../../../types/frontend';
import './ChatWindow.scss';

interface ChatWindowProps {
    chatId: string | null;
    messages: FrontendMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
    const { isLoading } = useChatStore();
    const { isLoading: isLoadingMessages } = useMessageStore();
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
