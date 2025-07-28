import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useChatStore } from '../stores/chat.store';
import './ChatInput.scss';

interface ChatInputProps {
    memoryId: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ memoryId }) => {
    const [message, setMessage] = useState('');
    const { sendMessage, isLoading } = useChatStore();

    const handleSubmit = async () => {
        if (!message.trim() || isLoading) return;

        const messageToSend = message.trim();
        setMessage('');

        try {
            await sendMessage(memoryId, messageToSend);
        } catch (error) {
            console.error('Failed to send message:', error);
            // Restore message on error
            setMessage(messageToSend);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="chat-input">
            <div className="input-container">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                    disabled={isLoading}
                    rows={1}
                    className="message-input"
                    data-testid="chat-input"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!message.trim() || isLoading}
                    className="send-button"
                    type="button"
                    data-testid="send-button"
                >
                    {isLoading ? (
                        <div className="loading-spinner" />
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M22 2L11 13L2 22L22 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M22 2L15 22L11 13L22 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};
