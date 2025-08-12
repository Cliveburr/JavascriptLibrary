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
        <div className="border-b pb-sm" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center justify-between px-xs pt-sm pb-xs">
                <h3 className="text-xs text-secondary uppercase" style={{ letterSpacing: '.05em', margin: 0 }}>Memórias</h3>
                <button
                    className="btn btn-outline btn-sm"
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
                <form className="bg-surface-2 border rounded-md p-sm mb-sm" onSubmit={handleCreateMemory}>
                    <input
                        type="text"
                        value={newMemoryName}
                        onChange={(e) => setNewMemoryName(e.target.value)}
                        placeholder="Nome da memória"
                        autoFocus
                        disabled={isLoading}
                        className="form-input mb-xs"
                    />
                    <div className="flex gap-xs">
                        <button
                            type="submit"
                            disabled={isLoading || !newMemoryName.trim()}
                            className="btn btn-primary btn-sm"
                        >
                            Criar
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateMemoryForm(false)}
                            className="btn btn-ghost btn-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="" style={{ maxHeight: 200, overflowY: 'auto' }}>
                {isLoading && memories.length === 0 ? (
                    <div className="py-sm text-center text-tertiary text-xs">Carregando memórias...</div>
                ) : (
                    memories.map((memory) => (
                        <div
                            key={memory.id}
                            className={`flex items-center justify-between p-xs mb-xxs rounded-sm border ${selectedMemoryId === memory.id ? 'border-primary bg-accent' : 'bg-surface-2'}`}
                            onClick={() => handleMemorySelect(memory.id)}
                        >
                            <span className="text-primary text-sm truncate flex-1">{memory.name}</span>
                            <button
                                className="btn btn-ghost btn-sm"
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
