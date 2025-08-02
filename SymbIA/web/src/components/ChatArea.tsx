import React, { useEffect, useRef } from 'react';
import { useMemoryStore, useChatStore } from '../stores';
import { ChatWindow } from './ChatWindow';
import { ChatInput, type ChatInputRef } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import { useNewChatStreaming } from '../hooks/useNewChatStreaming';
import './ChatArea.scss';
import { useLLMStore } from '../stores/llm.store';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();
    const { selectedChatId, messagesByChat, clearMessages } = useChatStore();
    const { isStreaming } = useNewChatStreaming();
    const { selectedSetId } = useLLMStore();
    const chatInputRef = useRef<ChatInputRef>(null);
    const wasStreamingRef = useRef(false);

    const currentMemory = memories.find(m => m.id === currentMemoryId);

    // Usar o selectedChatId já que o novo sistema já atualiza ele automaticamente
    const activeChatId = selectedChatId;
    const currentMessages = activeChatId ? messagesByChat[activeChatId] || [] : [];

    // Determinar se devemos mostrar a interface de chat ativa
    // Mostrar se temos um chat selecionado OU se estamos em streaming (novo chat ou existente)
    const shouldShowChatInterface = activeChatId || isStreaming;

    // Debug logs para verificar se as mensagens estão chegando
    console.log('ChatArea render basic:', {
        selectedChatId,
        messagesCount: currentMessages.length,
        isStreaming,
        allChatsCount: Object.keys(messagesByChat).length
    });

    console.log('ChatArea messagesByChat keys:', Object.keys(messagesByChat));

    if (activeChatId) {
        const messagesForThisChat = messagesByChat[activeChatId];
        console.log('Messages for active chat:', {
            chatId: activeChatId,
            messages: messagesForThisChat,
            messagesLength: messagesForThisChat?.length || 'undefined'
        });
    }

    // Clear messages when switching memories (if no chat selected)
    useEffect(() => {
        console.log('ChatArea useEffect triggered:', {
            selectedChatId,
            currentMemoryId,
            shouldClear: !selectedChatId
        });
        if (!selectedChatId) {
            console.log('Clearing messages because selectedChatId is null');
            clearMessages();
        }
    }, [currentMemoryId, selectedChatId]); // Removed clearMessages from dependencies    // Focar no input quando o streaming terminar
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

    return (
        <div className="chat-area">
            <div className="chat-content">
                {/* LLM Selector - posicionado normalmente no topo */}
                <LLMSelector />

                {currentMemory && shouldShowChatInterface ? (
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
