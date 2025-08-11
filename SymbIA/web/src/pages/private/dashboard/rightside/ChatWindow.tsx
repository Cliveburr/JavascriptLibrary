import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../ChatMessage';
import { useMessageStore } from '../../../../stores/message.store';
import { ChatStreamMessage, FrontendChatIteration } from '../../../../types';
import './ChatWindow.scss';

interface ChatWindowProps {
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ }) => {
    const { iterations } = useMessageStore();
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
    }, [iterations]);

    return (
        <div className="chat-window">
            <div
                className="messages-container"
                ref={scrollContainerRef}
                data-testid="messages-container"
            >

                {iterations.map((it: FrontendChatIteration, idx: number) => (
                    <div key={idx} className="chat-iteration">
                        {/* User message bubble */}
                        <ChatMessage message={{ modal: 'text', content: it.userMessage }} />
                        {/* Requests (assistant messages) */}
                        {it.requests.map((req: ChatStreamMessage, rIdx: number) => (
                            <ChatMessage key={`${idx}-${rIdx}`} message={req} />
                        ))}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
