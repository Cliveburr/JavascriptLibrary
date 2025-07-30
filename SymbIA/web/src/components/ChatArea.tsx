import React, { useEffect } from 'react';
import { useMemoryStore, useChatStore } from '../stores';
import { useAuthStore } from '../stores/auth.store';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { LLMSelector } from './LLMSelector';
import './ChatArea.scss';
import { useLLMStore } from '../stores/llm.store';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();
    const { selectedChatId, messagesByChat, clearMessages, createChat, updateChatTitle } = useChatStore();
    const { selectedSetId } = useLLMStore();

    const currentMemory = memories.find(m => m.id === currentMemoryId);
    const currentMessages = selectedChatId ? messagesByChat[selectedChatId] || [] : [];

    // Clear messages when switching memories (if no chat selected)
    useEffect(() => {
        if (!selectedChatId) {
            clearMessages();
        }
    }, [currentMemoryId, selectedChatId, clearMessages]);

    const handleStartNewChat = async (firstMessage: string) => {
        if (!currentMemory) return;

        try {
            // Cria novo chat sem nome (título vazio temporariamente)
            const newChat = await createChat(currentMemory.id, 'Novo Chat...');

            // Seleciona o novo chat imediatamente para mostrar o progresso
            useChatStore.getState().selectChat(newChat.id);

            // Envia primeira mensagem e aguarda o término do thought-cycle
            await useChatStore.getState().sendMessage(newChat.id, firstMessage);

            // APÓS o término do thought-cycle, gerar título usando LLM no modo "reasoning"
            try {
                const response = await fetch(`http://localhost:3002/llm-sets/generate-title`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
                    },
                    body: JSON.stringify({
                        chatId: newChat.id,
                        memoryId: currentMemory.id,
                        firstMessage,
                        llmSetId: selectedSetId
                    })
                }); if (response.ok) {
                    const data = await response.json();
                    if (data.title && data.title.trim()) {
                        // Atualiza a tela com o nome do chat correto
                        await updateChatTitle(newChat.id, data.title.trim());
                    }
                }
            } catch (titleError) {
                console.warn('Failed to generate chat title:', titleError);
                // Fallback: mantém o título temporário
            }
        } catch (error) {
            console.error('Failed to start new chat:', error);
            throw error;
        }
    };

    // Helper para obter token de autenticação
    const getAuthToken = () => {
        return useAuthStore.getState().token;
    };

    return (
        <div className="chat-area">
            <div className="chat-content">
                {/* LLM Selector - posicionado normalmente no topo */}
                <LLMSelector />

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
                        <h4>Iniciar novo chat</h4>
                        <p>Digite a primeira mensagem para iniciar um novo chat.</p>
                        <ChatInput
                            chatId={null}
                            horizontal
                            onStartNewChat={handleStartNewChat}
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
