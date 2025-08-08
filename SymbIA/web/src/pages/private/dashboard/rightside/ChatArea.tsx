import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChatStore } from '../../../../stores';
import { ChatWindow } from './ChatWindow';
import { ChatInput, type ChatInputRef } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import { useChatStreaming } from '../../../../hooks/useChatStreaming';
import './ChatArea.scss';
import { ChatDebug } from '../../../../components';

export const ChatArea: React.FC = () => {
    const { selectedChatId } = useChatStore();
    const { isStreaming } = useChatStreaming();
    const chatInputRef = useRef<ChatInputRef>(null);
    const wasStreamingRef = useRef(false);
    const [isDebugOpen, setIsDebugOpen] = useState(false);

    // Only show debug controls when VITE_DEBUG is true
    const debugEnabled = useMemo(() => {
        // Vite injects env values as strings
        return String(import.meta.env.VITE_DEBUG).toLowerCase() === 'true';
    }, []);

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
                    <>
                        <ChatWindow />
                        <ChatInput
                            ref={chatInputRef}
                        />
                    </>
                )}
            </div>
            {debugEnabled && (
                <>
                    <button
                        className="debug-button"
                        aria-label="Abrir debug"
                        title="Debug"
                        onClick={() => setIsDebugOpen(true)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    {isDebugOpen && (
                        <div
                            className="debug-modal-overlay"
                            role="dialog"
                            aria-modal="true"
                            onClick={() => setIsDebugOpen(false)}
                        >
                            <div
                                className="debug-modal"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="debug-modal-header">
                                    <h3>Chat Debug</h3>
                                    <button
                                        className="close-button"
                                        aria-label="Fechar"
                                        onClick={() => setIsDebugOpen(false)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 20 20">
                                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="debug-modal-content">
                                    <ChatDebug onClose={() => setIsDebugOpen(false)} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
