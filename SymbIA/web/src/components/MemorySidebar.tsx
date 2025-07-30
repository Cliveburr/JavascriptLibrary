import React, { useState, useEffect } from 'react';
import { useMemoryStore, useChatStore, useAuthStore } from '../stores';
import { UserProfileDropdown } from './UserProfileDropdown';
import './MemorySidebar.scss';

export const MemorySidebar: React.FC = () => {
    const {
        memories,
        currentMemoryId,
        isLoading: isLoadingMemories,
        error: memoriesError,
        fetchMemories,
        createMemory,
        deleteMemory,
        setCurrentMemory,
    } = useMemoryStore();

    const {
        chatsByMemory,
        selectedChatId,
        isLoadingChats,
        loadChatsByMemory,
        deleteChat,
        selectChat,
    } = useChatStore();

    const { setLastSelected } = useAuthStore();

    const [showCreateMemoryForm, setShowCreateMemoryForm] = useState(false);
    const [newMemoryName, setNewMemoryName] = useState('');

    // Carregar memórias quando o componente monta
    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    // Carregar chats quando a memória atual muda
    useEffect(() => {
        if (currentMemoryId && !chatsByMemory[currentMemoryId]) {
            loadChatsByMemory(currentMemoryId);
        }
    }, [currentMemoryId, chatsByMemory, loadChatsByMemory]);

    // Salvar última seleção quando muda
    useEffect(() => {
        if (currentMemoryId) {
            setLastSelected(currentMemoryId, selectedChatId || undefined);
        }
    }, [currentMemoryId, selectedChatId, setLastSelected]);

    const handleCreateMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemoryName.trim()) return;

        try {
            await createMemory(newMemoryName.trim());
            setNewMemoryName('');
            setShowCreateMemoryForm(false);
        } catch (err) {
            // Error is handled in the store
        }
    };

    const handleDeleteMemory = async (id: string) => {
        if (memories.length <= 1) return;

        const confirmed = window.confirm('Tem certeza que deseja deletar esta memória?');
        if (confirmed) {
            await deleteMemory(id);
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        const confirmed = window.confirm('Tem certeza que deseja deletar este chat?');
        if (confirmed) {
            await deleteChat(chatId);
        }
    };

    const handleMemorySelect = (memoryId: string) => {
        setCurrentMemory(memoryId);
        // Carregar chats da memória selecionada
        if (!chatsByMemory[memoryId]) {
            loadChatsByMemory(memoryId);
        }
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

                {memoriesError && (
                    <div className="error-message">
                        {memoriesError}
                    </div>
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

                    <div className="chats-list">
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
                                            handleDeleteChat(chat.id);
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
        </div>
    );
};
