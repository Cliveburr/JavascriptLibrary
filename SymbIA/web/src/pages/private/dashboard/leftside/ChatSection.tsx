import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMemoryStore, useChatStore, useMessageStore } from '../../../../stores';
import { useStreamingStore } from '../../../../stores/streaming.store';
import { useNotification } from '../../../../hooks/useNotification';
import { useError } from '../../../../hooks';
import { ConfirmModal } from '../../../../components/ui/modal/ConfirmModal';

export const ChatSection: React.FC = () => {
    const { selectedMemoryId } = useMemoryStore();

    const {
        chats,
        selectedChatId,
        isLoading,
        fetchChats,
        deleteChat,
        selectChat
    } = useChatStore();

    const { loadMessages } = useMessageStore();
    const { isStreaming } = useStreamingStore();

    const { success, error } = useNotification();
    const { handleError } = useError();

    const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string; } | null>(null);
    const [chatListKey, setChatListKey] = useState(0);
    const chatListRef = useRef<HTMLDivElement>(null);
    const prevChatCountRef = useRef<number>(0);

    // Carregar chats quando a memória atual muda
    useEffect(() => {
        if (selectedMemoryId) {
            fetchChats(selectedMemoryId);
        }
    }, [selectedMemoryId, fetchChats]);

    // Preparar novo chat quando não há chats na memória selecionada
    useEffect(() => {
        if (selectedMemoryId && chats.length === 0 && !isLoading) {
            selectChat(null);
        }
    }, [selectedMemoryId, chats.length, isLoading, selectChat]);

    // Carregar mensagens quando um chat é selecionado (mas NÃO durante streaming)
    useEffect(() => {
        if (selectedChatId && !isStreaming) {
            loadMessages(selectedChatId).catch((err) => {
                handleError(err, 'Carregando mensagens do chat');
                error('Erro ao carregar mensagens do chat');
            });
        }
    }, [selectedChatId, loadMessages, isStreaming]);

    // Scroll para o topo quando um novo chat é criado
    useEffect(() => {
        if (selectedMemoryId && chats.length > 0) {
            const currentChatCount = chats.length;

            // Se o número de chats aumentou, um novo chat foi criado
            if (currentChatCount > prevChatCountRef.current && chatListRef.current) {
                chatListRef.current.scrollTop = 0;
            }

            // Atualizar o contador anterior
            prevChatCountRef.current = currentChatCount;
        }
    }, [selectedMemoryId, chats.length]);

    const handleDeleteChat = useCallback((chatId: string, chatTitle: string) => {
        setChatToDelete({ id: chatId, title: chatTitle });
        setShowDeleteChatModal(true);
    }, []);

    const confirmDeleteChat = useCallback(async () => {
        if (!chatToDelete) return;

        try {
            await deleteChat(chatToDelete.id);

            // Forçar re-render da lista de chats
            setChatListKey(prev => prev + 1);

            // Forçar recarregamento da lista como fallback
            if (selectedMemoryId) {
                await fetchChats(selectedMemoryId);
            }
        } catch (err) {
            handleError(err, 'Deletando chat');
            error('Erro ao deletar chat. Tente novamente.');
        } finally {
            setShowDeleteChatModal(false);
            setChatToDelete(null);
        }
    }, [chatToDelete, deleteChat, success, selectedMemoryId, fetchChats, handleError, error]);

    const cancelDeleteChat = useCallback(() => {
        setShowDeleteChatModal(false);
        setChatToDelete(null);
    }, []);

    const currentMemoryChats = selectedMemoryId
        ? chats
            .filter(m => m.title.length > 0)
            .sort((a, b) => b.orderIndex - a.orderIndex)
        : [];

    if (!selectedMemoryId) {
        return null;
    }

    return (
        <>
            <div className="chats-section">
                <div className="section-header">
                    <h3>Chats</h3>
                    <button
                        className="add-button"
                        onClick={() => {
                            selectChat(null);
                        }}
                        disabled={isLoading}
                        title="Novo chat"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 3.5V8h4.5a.5.5 0 0 1 0 1H8v4.5a.5.5 0 0 1-1 0V9H2.5a.5.5 0 0 1 0-1H7V3.5a.5.5 0 0 1 1 0z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                <div className="chats-list" key={`chats-${selectedMemoryId}-${chatListKey}`} ref={chatListRef}>
                    {isLoading ? (
                        <div className="loading">Carregando chats...</div>
                    ) : currentMemoryChats.length === 0 ? (
                        <div className="empty-state">Nenhum chat nesta memória</div>
                    ) : (
                        currentMemoryChats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`chat-item ${selectedChatId === chat.id ? 'active' : ''}`}
                                onClick={() => selectChat(chat.id)}
                            >
                                <span className="chat-title">{chat.title}</span>
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChat(chat.id, chat.title);
                                    }}
                                    title="Deletar chat"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12">
                                        <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal de confirmação para deletar chat */}
            <ConfirmModal
                isOpen={showDeleteChatModal}
                title="Deletar Chat"
                message={`Tem certeza que deseja deletar o chat "${chatToDelete?.title}"? Esta ação não pode ser desfeita.`}
                confirmText="Deletar"
                cancelText="Cancelar"
                onConfirm={confirmDeleteChat}
                onCancel={cancelDeleteChat}
                isDestructive={true}
            />
        </>
    );
};
