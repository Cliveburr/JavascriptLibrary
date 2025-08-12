import React from 'react';
import type { PromptEntry } from '../../../../types/prompts';

interface PromptEntryEditorProps {
    value: PromptEntry;
    onChange: (next: PromptEntry) => void;
    onCancel: () => void;
    onSave: () => void;
}

export const PromptEntryEditor: React.FC<PromptEntryEditorProps> = ({ value, onChange, onCancel, onSave }) => {
    return (
        <div className="prompt-editor">
            <div className="form-grid">
                <div className="form-field">
                    <label className="form-label">Nome</label>
                    <input
                        type="text"
                        value={value.name}
                        onChange={(e) => onChange({ ...value, name: e.target.value })}
                        className="form-input"
                        placeholder="Nome do prompt"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Temperatura</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="2"
                        value={value.temperature ?? ''}
                        onChange={(e) => onChange({ ...value, temperature: e.target.value === '' ? undefined : Number(e.target.value) })}
                        className="form-input"
                        placeholder="Ex: 0.7"
                    />
                </div>
                <div className="form-field">
                    <label className="form-label">Max Tokens</label>
                    <input
                        type="number"
                        min="1"
                        value={value.maxTokens ?? ''}
                        onChange={(e) => onChange({ ...value, maxTokens: e.target.value === '' ? undefined : Number(e.target.value) })}
                        className="form-input"
                        placeholder="Ex: 2048"
                    />
                </div>
            </div>

            <div className="form-field">
                <label className="form-label">System Prompt</label>
                <textarea
                    className="form-textarea"
                    rows={12}
                    value={value.systemPrompt}
                    onChange={(e) => onChange({ ...value, systemPrompt: e.target.value })}
                    placeholder="Insira aqui o system prompt..."
                />
            </div>

            <div className="form-field">
                <label className="form-label">Context Convert (JavaScript)</label>
                <textarea
                    className="form-textarea code"
                    rows={12}
                    value={value.contextConvert}
                    onChange={(e) => onChange({ ...value, contextConvert: e.target.value })}
                    placeholder="function(ctx, promptName) { return JSON.stringify(ctx); }"
                />
                <div className="help-text">
                    Esta função recebe (ctx, promptName) e deve retornar uma string com o contexto.
                </div>
            </div>

            <div className="edit-actions" style={{ marginTop: 12 }}>
                <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
                <button className="btn btn-primary" onClick={onSave}>Salvar Prompt</button>
            </div>
        </div>
    );
};
