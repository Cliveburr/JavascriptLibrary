import React, { useState, useEffect, useRef } from 'react';
import { useMemoryStore, useChatStore, useMessageStore } from '../../../../stores';
import { useNotification } from '../../../../hooks/useNotification';
import { useError } from '../../../../hooks';
import { ConfirmModal } from '../../../../components/ui/modal/ConfirmModal';

export const ChatSection: React.FC = () => {
    const { currentMemoryId } = useMemoryStore();

    const {
        chatsByMemory,
        selectedChatId,
        lastSelectedChatId,
        isLoadingChats,
        loadChatsByMemory,
        deleteChat,
        selectChat,
        setLastSelectedChat,
    } = useChatStore();

    const { loadMessages } = useMessageStore();

    const { success, error } = useNotification();
    const { handleError } = useError();

    const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string; } | null>(null);
    const [chatListKey, setChatListKey] = useState(0);
    const chatListRef = useRef<HTMLDivElement>(null);
    const prevChatCountRef = useRef<number>(0);

    // Carregar chats quando a memória atual muda
    useEffect(() => {
        if (currentMemoryId && !chatsByMemory[currentMemoryId]) {
            loadChatsByMemory(currentMemoryId);
        }
    }, [currentMemoryId, loadChatsByMemory]);

    // Restaurar último chat selecionado quando os chats estão carregados
    useEffect(() => {
        if (currentMemoryId && chatsByMemory[currentMemoryId] && lastSelectedChatId && !selectedChatId) {
            const chats = chatsByMemory[currentMemoryId];
            const chatExists = chats.some(chat => chat.id === lastSelectedChatId);
            if (chatExists) {
                selectChat(lastSelectedChatId);
            }
        }
    }, [currentMemoryId, lastSelectedChatId, selectedChatId, selectChat]);

    // Carregar mensagens quando um chat é selecionado
    useEffect(() => {
        if (selectedChatId) {
            loadMessages(selectedChatId).catch((err) => {
                handleError(err, 'Carregando mensagens do chat');
                error('Erro ao carregar mensagens do chat');
            });
        }
    }, [selectedChatId, loadMessages]);

    // Salvar última seleção do chat quando muda
    useEffect(() => {
        if (selectedChatId) {
            setLastSelectedChat(selectedChatId);
        }
    }, [selectedChatId, setLastSelectedChat]);

    // Scroll para o topo quando um novo chat é criado
    useEffect(() => {
        if (currentMemoryId && chatsByMemory[currentMemoryId]) {
            const chats = chatsByMemory[currentMemoryId];
            const currentChatCount = chats.length;

            // Se o número de chats aumentou, um novo chat foi criado
            if (currentChatCount > prevChatCountRef.current && chatListRef.current) {
                chatListRef.current.scrollTop = 0;
            }

            // Atualizar o contador anterior
            prevChatCountRef.current = currentChatCount;
        }
    }, [currentMemoryId, chatsByMemory]);

    const handleDeleteChat = (chatId: string, chatTitle: string) => {
        setChatToDelete({ id: chatId, title: chatTitle });
        setShowDeleteChatModal(true);
    };

    const confirmDeleteChat = async () => {
        if (!chatToDelete) return;

        try {
            await deleteChat(chatToDelete.id);
            success('Chat deletado com sucesso');

            // Forçar re-render da lista de chats
            setChatListKey(prev => prev + 1);

            // Forçar recarregamento da lista como fallback
            if (currentMemoryId) {
                await loadChatsByMemory(currentMemoryId);
            }
        } catch (err) {
            handleError(err, 'Deletando chat');
            error('Erro ao deletar chat. Tente novamente.');
        } finally {
            setShowDeleteChatModal(false);
            setChatToDelete(null);
        }
    };

    const cancelDeleteChat = () => {
        setShowDeleteChatModal(false);
        setChatToDelete(null);
    };

    const currentMemoryChats = currentMemoryId
        ? (chatsByMemory[currentMemoryId] || []).sort((a, b) => a.orderIndex - b.orderIndex)
        : [];

    if (!currentMemoryId) {
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
                            // Limpar seleção de chat para mostrar o input horizontal
                            selectChat(null);
                        }}
                        disabled={isLoadingChats}
                        title="Novo chat"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 3.5V8h4.5a.5.5 0 0 1 0 1H8v4.5a.5.5 0 0 1-1 0V9H2.5a.5.5 0 0 1 0-1H7V3.5a.5.5 0 0 1 1 0z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                <div className="chats-list" key={`chats-${currentMemoryId}-${chatListKey}`} ref={chatListRef}>
                    {isLoadingChats ? (
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
