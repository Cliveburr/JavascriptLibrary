import React, { useState } from 'react';
import { useMemoryStore } from '../stores';
import './MemorySidebar.scss';

export const MemorySidebar: React.FC = () => {
    const {
        memories,
        currentMemoryId,
        isLoading,
        error,
        createMemory,
        deleteMemory,
        setCurrentMemory,
    } = useMemoryStore();

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newMemoryName, setNewMemoryName] = useState('');

    const handleCreateMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemoryName.trim()) return;

        try {
            await createMemory(newMemoryName.trim());
            setNewMemoryName('');
            setShowCreateForm(false);
        } catch (err) {
            // Error is handled in the store
        }
    };

    const handleDeleteMemory = async (id: string) => {
        if (memories.length <= 1) return;

        const confirmed = window.confirm('Are you sure you want to delete this memory?');
        if (confirmed) {
            await deleteMemory(id);
        }
    };

    return (
        <div className="memory-sidebar">
            <div className="sidebar-header">
                <h2>Memories</h2>
                <button
                    className="add-memory-button"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    disabled={isLoading}
                >
                    +
                </button>
            </div>

            {showCreateForm && (
                <form className="create-memory-form" onSubmit={handleCreateMemory}>
                    <input
                        type="text"
                        value={newMemoryName}
                        onChange={(e) => setNewMemoryName(e.target.value)}
                        placeholder="Memory name"
                        autoFocus
                        disabled={isLoading}
                    />
                    <div className="form-actions">
                        <button type="submit" disabled={isLoading || !newMemoryName.trim()}>
                            Create
                        </button>
                        <button type="button" onClick={() => setShowCreateForm(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="memories-list">
                {isLoading && memories.length === 0 ? (
                    <div className="loading">Loading memories...</div>
                ) : (
                    memories.map((memory) => (
                        <div
                            key={memory.id}
                            className={`memory-item ${currentMemoryId === memory.id ? 'active' : ''}`}
                            onClick={() => setCurrentMemory(memory.id)}
                        >
                            <div className="memory-info">
                                <div className="memory-name">{memory.name}</div>
                                <div className="memory-date">
                                    {new Date(memory.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <button
                                className="delete-memory-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMemory(memory.id);
                                }}
                                disabled={memories.length <= 1 || isLoading}
                                title={memories.length <= 1 ? 'Cannot delete the last memory' : 'Delete memory'}
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
