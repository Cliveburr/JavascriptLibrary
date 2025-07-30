import React, { useEffect, useRef } from 'react';
import { useMemoryStore, useChatStore } from '../stores';
import { ChatWindow } from './ChatWindow';
import { ChatInput, type ChatInputRef } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import './ChatArea.scss';
import { useLLMStore } from '../stores/llm.store';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();
    const { selectedChatId, messagesByChat, clearMessages, isStreaming, streamingChatId } = useChatStore();
    const { selectedSetId } = useLLMStore();
    const chatInputRef = useRef<ChatInputRef>(null);
    const wasStreamingRef = useRef(false);

    const currentMemory = memories.find(m => m.id === currentMemoryId);

    // Durante streaming, usar streamingChatId, senão usar selectedChatId
    const activeChatId = streamingChatId || selectedChatId;
    const currentMessages = activeChatId ? messagesByChat[activeChatId] || [] : [];

    // Detectar se estamos em modo de streaming para novo chat
    const isStreamingNewChat = isStreaming && !selectedChatId;

    // Clear messages when switching memories (if no chat selected)
    useEffect(() => {
        if (!selectedChatId) {
            clearMessages();
        }
    }, [currentMemoryId, selectedChatId, clearMessages]);

    // Focar no input quando o streaming terminar
    useEffect(() => {
        // Se estava em streaming e agora não está mais, focar no input
        if (wasStreamingRef.current && !isStreaming) {
            // Usar setTimeout para garantir que o DOM foi atualizado
            setTimeout(() => {
                chatInputRef.current?.focus();
            }, 100);
        }

        // Atualizar o estado anterior do streaming
        wasStreamingRef.current = isStreaming;
    }, [isStreaming]);

    const handleStartNewChat = async (firstMessage: string) => {
        if (!currentMemory || !selectedSetId) return;

        try {
            console.log('Starting new chat with message:', firstMessage);
            // Não cria o chat antecipadamente, deixa o sendStreamingMessage criar
            // Envia primeira mensagem que irá criar o chat automaticamente
            await useChatStore.getState().sendStreamingMessage(currentMemory.id, null, firstMessage, selectedSetId);
        } catch (error) {
            console.error('Failed to start new chat:', error);
            throw error;
        }
    };

    return (
        <div className="chat-area">
            <div className="chat-content">
                {/* LLM Selector - posicionado normalmente no topo */}
                <LLMSelector />

                {currentMemory && (activeChatId || isStreamingNewChat) ? (
                    <>
                        <ChatWindow
                            chatId={activeChatId}
                            messages={currentMessages}
                        />
                        <ChatInput
                            ref={chatInputRef}
                            chatId={selectedChatId}
                            memoryId={currentMemory.id}
                            llmSetId={selectedSetId || undefined}
                        />
                    </>
                ) : currentMemory ? (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">💬</div>
                        <h4>Iniciar novo chat</h4>
                        <p>Digite a primeira mensagem para iniciar um novo chat.</p>
                        <ChatInput
                            ref={chatInputRef}
                            chatId={null}
                            memoryId={currentMemory.id}
                            horizontal
                            onStartNewChat={handleStartNewChat}
                            llmSetId={selectedSetId || undefined}
                        />
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
