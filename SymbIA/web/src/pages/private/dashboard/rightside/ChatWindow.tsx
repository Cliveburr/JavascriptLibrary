import React, { useEffect, useRef } from 'react';
import { AssistantMessage } from '../messages/AssistantMessage';
import { useMessageStore } from '../../../../stores/message.store';
import { useStreamingStore } from '../../../../stores/streaming.store';
import { UserMessage } from '../messages/UserMessage';
import './ChatWindow.scss';

interface ChatWindowProps {
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ }) => {
    const { iterations } = useMessageStore();
    const { errorMessage } = useStreamingStore();
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
                {iterations.map((it, idx) => (
                    <div key={idx} className="chat-iteration">
                        <UserMessage content={it.userMessage} />
                        {it.assistants.map((req, rIdx) => (
                            <AssistantMessage key={`${idx}-${rIdx}`} message={req} />
                        ))}
                    </div>
                ))}

                {errorMessage && (
                    <div className="ephemeral-error" role="alert">
                        <div className="error-icon">⚠️</div>
                        <div className="error-text">{errorMessage}</div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
