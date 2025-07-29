import React, { useEffect } from 'react';
import { useMemoryStore, useChatStore } from '../stores';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import './ChatArea.scss';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();
    const { selectedChatId, messagesByChat, clearMessages } = useChatStore();

    const currentMemory = memories.find(m => m.id === currentMemoryId);
    const currentMessages = selectedChatId ? messagesByChat[selectedChatId] || [] : [];

    // Clear messages when switching memories (if no chat selected)
    useEffect(() => {
        if (!selectedChatId) {
            clearMessages();
        }
    }, [currentMemoryId, selectedChatId, clearMessages]);

    return (
        <div className="chat-area">
            {/* LLM Selector - flutuante no canto superior esquerdo */}
            <LLMSelector />

            <div className="chat-content">
                {currentMemory && selectedChatId ? (
                    <>
                        <ChatWindow
                            chatId={selectedChatId}
                            messages={currentMessages}
                        />
                        <ChatInput chatId={selectedChatId} />
                    </>
                ) : currentMemory ? (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">💬</div>
                        <h4>Selecione um Chat</h4>
                        <p>Escolha um chat existente ou crie um novo para começar a conversar.</p>
                    </div>
                ) : (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">🤖</div>
                        <h4>Bem-vindo ao SymbIA</h4>
                        <p>Selecione ou crie uma memória na barra lateral para começar a conversar com seu assistente IA.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
