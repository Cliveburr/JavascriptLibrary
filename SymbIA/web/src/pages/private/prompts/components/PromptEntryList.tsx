import React from 'react';
import type { PromptEntry } from '../../../../types/prompts';

interface PromptEntryListProps {
    prompts: PromptEntry[];
    onAdd: () => void;
    onEdit: (index: number) => void;
    onRemove: (index: number) => void;
}

export const PromptEntryList: React.FC<PromptEntryListProps> = ({ prompts, onAdd, onEdit, onRemove }) => {
    return (
        <div className="prompt-list">
            <div className="prompt-list-header">
                <div className="form-section-title" style={{ margin: 0 }}>Prompts ({prompts.length})</div>
                <button className="btn btn-primary" onClick={onAdd}>➕ Adicionar Prompt</button>
            </div>

            {prompts.length === 0 ? (
                <div className="empty-state" style={{ marginTop: 12 }}>
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-title">Nenhum prompt</div>
                    <div className="empty-state-subtitle">Clique em "Adicionar Prompt" para criar o primeiro.</div>
                </div>
            ) : (
                <div className="prompt-list-body">
                    {prompts.map((p, i) => (
                        <div key={i} className="prompt-row">
                            <div className="prompt-row-main">
                                <div className="prompt-row-title">
                                    <strong>{p.name || '(sem nome)'}</strong>
                                </div>
                                <div className="prompt-row-meta">
                                    <span title="Temperatura" className="status-badge">🌡️ {p.temperature ?? '—'}</span>
                                    <span title="Máx. tokens" className="status-badge info">🔢 {p.maxTokens ?? '—'}</span>
                                </div>
                                <div className="prompt-row-preview">
                                    {(p.systemPrompt || '').split('\n')[0] || 'Sem preview do systemPrompt'}
                                </div>
                            </div>
                            <div className="actions-cell">
                                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(i)} title="Editar">✏️</button>
                                <button className="btn btn-danger btn-sm" onClick={() => onRemove(i)} title="Excluir">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
