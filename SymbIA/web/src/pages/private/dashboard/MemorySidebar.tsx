import React, { useState, useEffect, useRef } from 'react';
import { useMemoryStore, useChatStore, useMessageStore } from '../../../stores';
import { useNotification } from '../../../hooks/useNotification';
import { useError } from '../../../hooks';
import { UserProfileDropdown } from './UserProfileDropdown';
import { ConfirmModal } from '../../../components/ui/modal/ConfirmModal';
import './MemorySidebar.scss';

export const MemorySidebar: React.FC = () => {
    const {
        memories,
        currentMemoryId,
        isLoading: isLoadingMemories,
        fetchMemories,
        createMemory,
        deleteMemory,
        setCurrentMemory,
    } = useMemoryStore();

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

    const { removeMessagesFromChat, messagesByChat, loadMessages } = useMessageStore();

    const { success, error, warning } = useNotification();
    const { handleError } = useError();

    const [showCreateMemoryForm, setShowCreateMemoryForm] = useState(false);
    const [newMemoryName, setNewMemoryName] = useState('');
    const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string; } | null>(null);
    const [chatListKey, setChatListKey] = useState(0); // Para forçar re-render
    const chatListRef = useRef<HTMLDivElement>(null); // Referência para a lista de chats
    const prevChatCountRef = useRef<number>(0); // Para detectar novos chats

    // Carregar memórias quando o componente monta
    useEffect(() => {
        fetchMemories().catch((err) => {
            handleError(err, 'Carregando memórias');
            error('Erro carregando memorias!');
        });
    }, [fetchMemories]); // Removidas dependências desnecessárias

    // Carregar chats quando a memória atual muda
    useEffect(() => {
        if (currentMemoryId && !chatsByMemory[currentMemoryId]) {
            loadChatsByMemory(currentMemoryId);
        }
    }, [currentMemoryId, loadChatsByMemory]); // Removido chatsByMemory das dependências

    // Restaurar último chat selecionado quando os chats estão carregados
    useEffect(() => {
        if (currentMemoryId && chatsByMemory[currentMemoryId] && lastSelectedChatId && !selectedChatId) {
            const chats = chatsByMemory[currentMemoryId];
            const chatExists = chats.some(chat => chat.id === lastSelectedChatId);
            if (chatExists) {
                selectChat(lastSelectedChatId);
            }
        }
    }, [currentMemoryId, lastSelectedChatId, selectedChatId, selectChat]); // Removido chatsByMemory das dependências

    // Carregar mensagens quando um chat é selecionado
    useEffect(() => {
        if (selectedChatId && !messagesByChat[selectedChatId]) {
            loadMessages(selectedChatId).catch((err) => {
                handleError(err, 'Carregando mensagens do chat');
                error('Erro ao carregar mensagens do chat');
            });
        }
    }, [selectedChatId, loadMessages]); // Removido messagesByChat das dependências

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

    const handleCreateMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemoryName.trim()) return;

        try {
            await createMemory(newMemoryName.trim());
            setNewMemoryName('');
            setShowCreateMemoryForm(false);
            success('Memória criada com sucesso!');
        } catch (err) {
            handleError(err, 'Criando memória');
            error('Erro ao criar memória. Tente novamente.');
        }
    };

    const handleDeleteMemory = async (id: string) => {
        if (memories.length <= 1) {
            warning('Não é possível deletar a última memória');
            return;
        }

        const confirmed = window.confirm('Tem certeza que deseja deletar esta memória?');
        if (confirmed) {
            try {
                await deleteMemory(id);
                success('Memória deletada com sucesso');
            } catch (err) {
                handleError(err, 'Deletando memória');
                error('Erro ao deletar memória. Tente novamente.');
            }
        }
    };

    const handleDeleteChat = (chatId: string, chatTitle: string) => {
        setChatToDelete({ id: chatId, title: chatTitle });
        setShowDeleteChatModal(true);
    };

    const confirmDeleteChat = async () => {
        if (!chatToDelete) return;

        try {
            await deleteChat(chatToDelete.id);
            // Remover mensagens do chat deletado
            removeMessagesFromChat(chatToDelete.id);
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
    }; const cancelDeleteChat = () => {
        setShowDeleteChatModal(false);
        setChatToDelete(null);
    };

    const handleMemorySelect = (memoryId: string) => {
        setCurrentMemory(memoryId);
        // Carregar chats da memória selecionada se ainda não carregados
        const memoryChats = useChatStore.getState().chatsByMemory[memoryId];
        if (!memoryChats || memoryChats.length === 0) {
            loadChatsByMemory(memoryId);
        }
        selectChat(null);
    };

    const currentMemoryChats = currentMemoryId
        ? (chatsByMemory[currentMemoryId] || []).sort((a, b) => a.orderIndex - b.orderIndex)
        : [];

    return (
        <div className="memory-sidebar">
            {/* Logo Section */}
            <div className="logo-section">
                <a href="/" className="logo-link">
                    <img
                        src="/logo.png"
                        alt="SymbIA"
                        className="logo-image"
                    />
                </a>
            </div>

            {/* User Profile Section */}
            <div className="user-section">
                <UserProfileDropdown />
            </div>

            {/* Memories Section */}
            <div className="memories-section">
                <div className="section-header">
                    <h3>Memórias</h3>
                    <button
                        className="add-button"
                        onClick={() => setShowCreateMemoryForm(!showCreateMemoryForm)}
                        disabled={isLoadingMemories}
                        title="Adicionar memória"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 3.5V8h4.5a.5.5 0 0 1 0 1H8v4.5a.5.5 0 0 1-1 0V9H2.5a.5.5 0 0 1 0-1H7V3.5a.5.5 0 0 1 1 0z" fill="currentColor" />
                        </svg>
                    </button>
                </div>

                {showCreateMemoryForm && (
                    <form className="create-form" onSubmit={handleCreateMemory}>
                        <input
                            type="text"
                            value={newMemoryName}
                            onChange={(e) => setNewMemoryName(e.target.value)}
                            placeholder="Nome da memória"
                            autoFocus
                            disabled={isLoadingMemories}
                        />
                        <div className="form-actions">
                            <button
                                type="submit"
                                disabled={isLoadingMemories || !newMemoryName.trim()}
                                className="confirm-btn"
                            >
                                Criar
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateMemoryForm(false)}
                                className="cancel-btn"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                <div className="memories-list">
                    {isLoadingMemories && memories.length === 0 ? (
                        <div className="loading">Carregando memórias...</div>
                    ) : (
                        memories.map((memory) => (
                            <div
                                key={memory.id}
                                className={`memory-item ${currentMemoryId === memory.id ? 'active' : ''}`}
                                onClick={() => handleMemorySelect(memory.id)}
                            >
                                <span className="memory-name">{memory.name}</span>
                                <button
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteMemory(memory.id);
                                    }}
                                    disabled={memories.length <= 1 || isLoadingMemories}
                                    title={memories.length <= 1 ? 'Não é possível deletar a última memória' : 'Deletar memória'}
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

            {/* Chats Section */}
            {currentMemoryId && (
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
            )}

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
        </div>
    );
};
