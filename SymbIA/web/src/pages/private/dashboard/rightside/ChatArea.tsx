import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../../../stores';
import { ChatWindow } from './ChatWindow';
import { ChatInput, type ChatInputRef } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import { useChatStreaming } from '../../../../hooks/useChatStreaming';
import './ChatArea.scss';

export const ChatArea: React.FC = () => {
    const { selectedChatId } = useChatStore();
    const { isStreaming } = useChatStreaming();
    const chatInputRef = useRef<ChatInputRef>(null);
    const wasStreamingRef = useRef(false);

    const isChatState = selectedChatId || isStreaming;

    useEffect(() => {
        if (wasStreamingRef.current && !isStreaming) {
            setTimeout(() => {
                chatInputRef.current?.focus();
            }, 100);
        }
        wasStreamingRef.current = isStreaming;
    }, [isStreaming]);

    return (
        <div className="chat-area">
            <div className="chat-content">
                <LLMSelector />
                {!isChatState ? (
                    // Interface de preparação para novo chat com input centralizado
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">💬</div>
                        <h4>Iniciar novo chat</h4>
                        <p>Digite a primeira mensagem para iniciar um novo chat.</p>
                        <ChatInput
                            ref={chatInputRef}
                            horizontal
                        />
                    </div>
                ) : (
                    // Interface normal de chat
                    <>
                        <ChatWindow />
                        <ChatInput
                            ref={chatInputRef}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
