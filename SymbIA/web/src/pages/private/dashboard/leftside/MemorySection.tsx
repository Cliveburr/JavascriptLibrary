import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMemoryStore, useChatStore } from '../../../../stores';
import { useNotification } from '../../../../hooks/useNotification';
import { useError } from '../../../../hooks';

export const MemorySection: React.FC = () => {
    const {
        memories,
        selectedMemoryId,
        isLoading,
        fetchMemories,
        createMemory,
        deleteMemory,
        setCurrentMemory,
    } = useMemoryStore();

    const { selectChat } = useChatStore();

    const { success, error, warning } = useNotification();
    const { handleError } = useError();

    const [showCreateMemoryForm, setShowCreateMemoryForm] = useState(false);
    const [newMemoryName, setNewMemoryName] = useState('');
    const hasInitialized = useRef(false);

    // Carregar memórias quando o componente monta (apenas uma vez)
    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            fetchMemories().catch((err) => {
                handleError(err, 'Carregando memórias');
                error('Erro carregando memorias!');
            });
        }
    }, []); // Array vazio - executa apenas uma vez

    const handleCreateMemory = useCallback(async (e: React.FormEvent) => {
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
    }, [newMemoryName, createMemory, success, handleError, error]);

    const handleDeleteMemory = useCallback(async (id: string) => {
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
    }, [memories.length, warning, deleteMemory, success, handleError, error]);

    const handleMemorySelect = useCallback((memoryId: string) => {
        setCurrentMemory(memoryId);
        selectChat(null);
    }, [setCurrentMemory, selectChat]);

    return (
        <div className="memories-section">
            <div className="section-header">
                <h3>Memórias</h3>
                <button
                    className="add-button"
                    onClick={() => setShowCreateMemoryForm(!showCreateMemoryForm)}
                    disabled={isLoading}
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
                        disabled={isLoading}
                    />
                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isLoading || !newMemoryName.trim()}
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
                {isLoading && memories.length === 0 ? (
                    <div className="loading">Carregando memórias...</div>
                ) : (
                    memories.map((memory) => (
                        <div
                            key={memory.id}
                            className={`memory-item ${selectedMemoryId === memory.id ? 'active' : ''}`}
                            onClick={() => handleMemorySelect(memory.id)}
                        >
                            <span className="memory-name">{memory.name}</span>
                            <button
                                className="delete-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMemory(memory.id);
                                }}
                                disabled={memories.length <= 1 || isLoading}
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
    );
};
