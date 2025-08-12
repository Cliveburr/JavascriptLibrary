import React, { useEffect, useState } from 'react';
import { apiService } from '../../../utils/apiService';
import type { PromptEntry, PromptSetDTO, PromptSetSummaryDTO } from '../../../types/prompts';
import { useNotificationStore } from '../../../stores/notification.store';
import './PromptSetsPage.scss';
import { PromptEntryEditor } from './components/PromptEntryEditor';
import { PromptEntryList } from './components/PromptEntryList';

type TabKey = 'promptSets';

const emptyPrompt: PromptEntry = {
    name: '',
    systemPrompt: '',
    contextConvert: '(ctx, promptName) => JSON.stringify(ctx)',
};

const emptySet: Omit<PromptSetDTO, '_id' | 'promptTestResultIds'> = {
    alias: '',
    observation: '',
    manualVersion: 1,
    tuningVersion: 0,
    isForTunning: false,
    prompts: [{ ...emptyPrompt }],
};

export const PromptSetsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('promptSets');
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<PromptSetSummaryDTO[]>([]);
    const [editing, setEditing] = useState<PromptSetDTO | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [form, setForm] = useState<Omit<PromptSetDTO, '_id' | 'promptTestResultIds'>>({ ...emptySet });
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPromptIndex, setEditingPromptIndex] = useState<number | null>(null);

    const { addNotification } = useNotificationStore();

    const refresh = async () => {
        setLoading(true);
        try {
            const data = await apiService.prompts.listSummaries();
            setItems(data);
        } catch (error) {
            console.error('Erro ao carregar PromptSets:', error);
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar PromptSets'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const filteredItems = items.filter(item =>
        item.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.observation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onAdd = () => {
        console.log('onAdd called'); // Debug
        setEditing(null);
        setIsCreating(true);
        setForm({ ...emptySet, prompts: [{ ...emptyPrompt }] });
    };

    const onEdit = async (id: string) => {
        setLoading(true);
        try {
            const item = await apiService.prompts.getById(id);
            setEditing(item);
            setIsCreating(false);
            const { _id, promptTestResultIds, ...rest } = item;
            setForm(rest);
        } catch (error) {
            console.error('Erro ao carregar PromptSet:', error);
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar PromptSet'
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelEdit = () => {
        setEditing(null);
        setIsCreating(false);
        setForm({ ...emptySet, prompts: [{ ...emptyPrompt }] });
    };

    const save = async () => {
        // Validação básica
        if (!form.alias.trim()) {
            addNotification({
                type: 'warning',
                title: 'Validação',
                message: 'O campo Alias é obrigatório'
            });
            return;
        }

        setLoading(true);
        try {
            if (editing && !isCreating) {
                await apiService.prompts.update(editing._id, form);
                addNotification({
                    type: 'success',
                    message: 'PromptSet atualizado com sucesso'
                });
            } else {
                await apiService.prompts.create(form);
                addNotification({
                    type: 'success',
                    message: 'PromptSet criado com sucesso'
                });
            }
            setEditing(null);
            setIsCreating(false);
            setForm({ ...emptySet, prompts: [{ ...emptyPrompt }] });
            await refresh();
        } catch (error) {
            console.error('Erro ao salvar PromptSet:', error);
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar. Verifique os dados e tente novamente.'
            });
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este PromptSet?')) return;
        setLoading(true);
        try {
            await apiService.prompts.remove(id);
            await refresh();
            addNotification({
                type: 'success',
                message: 'PromptSet excluído com sucesso'
            });
        } catch (error) {
            console.error('Erro ao excluir PromptSet:', error);
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao excluir PromptSet'
            });
        } finally {
            setLoading(false);
        }
    };

    const onSetCurrent = async (id: string) => {
        setLoading(true);
        try {
            await apiService.prompts.setCurrent(id);
            await refresh();
            addNotification({
                type: 'success',
                message: 'PromptSet definido como atual'
            });
        } catch (error) {
            console.error('Erro ao definir PromptSet atual:', error);
            addNotification({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao definir PromptSet atual'
            });
        } finally {
            setLoading(false);
        }
    };

    const isInEditMode = editing || isCreating;

    return (
        <div className="prompts-page">
            <div className="page-header">
                <h1 className="page-title">Gerenciamento de Prompts</h1>
                <p className="page-subtitle">Configure e gerencie os conjuntos de prompts do sistema</p>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'promptSets' ? 'active' : ''}
                    onClick={() => setActiveTab('promptSets')}
                >
                    📝 PromptSets
                </button>
            </div>

            {activeTab === 'promptSets' && (
                <div className="tab-content">
                    {!isInEditMode ? (
                        <div className="list-view">
                            <div className="toolbar">
                                <div className="toolbar-left">
                                    <input
                                        type="text"
                                        placeholder="🔍 Buscar por alias ou observação..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-box"
                                    />
                                    <span style={{ color: '#a0a0a0', fontSize: '14px' }}>
                                        {filteredItems.length} de {items.length} itens
                                    </span>
                                </div>
                                <div className="toolbar-right">
                                    <button onClick={onAdd} className="btn btn-primary">
                                        ✨ Novo PromptSet
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading">Carregando PromptSets...</div>
                            ) : filteredItems.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-state-icon">📝</div>
                                    <div className="empty-state-title">Nenhum PromptSet encontrado</div>
                                    <div className="empty-state-subtitle">
                                        {items.length === 0
                                            ? 'Crie seu primeiro PromptSet para começar'
                                            : 'Tente ajustar os filtros de busca'
                                        }
                                    </div>
                                    {items.length === 0 && (
                                        <button onClick={onAdd} className="btn btn-primary">
                                            Criar Primeiro PromptSet
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <table className="list-table">
                                    <thead>
                                        <tr>
                                            <th>Alias</th>
                                            <th>Versão Manual</th>
                                            <th>Versão Tuning</th>
                                            <th>Prompts</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredItems.map(item => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div>
                                                        <strong>{item.alias}</strong>
                                                        {item.observation && (
                                                            <div style={{ fontSize: '12px', color: '#a0a0a0', marginTop: '4px' }}>
                                                                {item.observation}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>{item.manualVersion}</td>
                                                <td>{item.tuningVersion}</td>
                                                <td>
                                                    <span className="status-badge info">
                                                        {item.promptsCount} prompt{item.promptsCount !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td>
                                                    {item.isCurrent ? (
                                                        <span className="status-badge success">
                                                            ⭐ Atual
                                                        </span>
                                                    ) : (
                                                        <span className="status-badge">
                                                            Inativo
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="actions-cell">
                                                        <button
                                                            onClick={() => onEdit(item._id)}
                                                            className="btn btn-secondary btn-sm"
                                                            title="Editar"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(item._id)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Excluir"
                                                        >
                                                            🗑️
                                                        </button>
                                                        {!item.isCurrent && (
                                                            <button
                                                                onClick={() => onSetCurrent(item._id)}
                                                                className="btn btn-success btn-sm"
                                                                title="Definir como atual"
                                                            >
                                                                ⭐
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="edit-view">
                            <div className="edit-header">
                                <h2 className="edit-title">
                                    {isCreating ? '✨ Novo PromptSet' : '✏️ Editar PromptSet'}
                                </h2>
                                <div className="edit-actions">
                                    <button
                                        onClick={cancelEdit}
                                        className="btn btn-secondary"
                                        disabled={loading}
                                    >
                                        ← Voltar
                                    </button>
                                    <button
                                        onClick={save}
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? '⏳ Salvando...' : '💾 Salvar'}
                                    </button>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="form-section-title">⚙️ Configurações Básicas</h3>
                                <div className="form-grid">
                                    <div className="form-field">
                                        <label className="form-label">Alias *</label>
                                        <input
                                            type="text"
                                            value={form.alias}
                                            onChange={(e) => setForm({ ...form, alias: e.target.value })}
                                            placeholder="Nome identificador do PromptSet"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">Observação</label>
                                        <input
                                            type="text"
                                            value={form.observation}
                                            onChange={(e) => setForm({ ...form, observation: e.target.value })}
                                            placeholder="Descrição ou notas sobre este PromptSet"
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">Versão Manual</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={form.manualVersion}
                                            onChange={(e) => setForm({ ...form, manualVersion: Number(e.target.value) })}
                                            className="form-input"
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label className="form-label">Versão Tuning</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.tuningVersion}
                                            onChange={(e) => setForm({ ...form, tuningVersion: Number(e.target.value) })}
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-checkbox">
                                    <input
                                        type="checkbox"
                                        id="isForTunning"
                                        checked={form.isForTunning}
                                        onChange={(e) => setForm({ ...form, isForTunning: e.target.checked })}
                                    />
                                    <label htmlFor="isForTunning" className="form-checkbox-label">
                                        🔧 Destinado para Tuning Automático
                                    </label>
                                </div>
                            </div>

                            <div className="form-section">
                                <h3 className="form-section-title">📝 Prompts</h3>
                                {editingPromptIndex === null ? (
                                    <PromptEntryList
                                        prompts={form.prompts}
                                        onAdd={() => {
                                            const next = [...form.prompts, { ...emptyPrompt }];
                                            setForm({ ...form, prompts: next });
                                            setEditingPromptIndex(next.length - 1);
                                        }}
                                        onEdit={(index) => setEditingPromptIndex(index)}
                                        onRemove={(index) => {
                                            const next = form.prompts.filter((_, i) => i !== index);
                                            setForm({ ...form, prompts: next });
                                        }}
                                    />
                                ) : (
                                    <PromptEntryEditor
                                        value={form.prompts[editingPromptIndex]}
                                        onChange={(next) => {
                                            const arr = [...form.prompts];
                                            arr[editingPromptIndex] = next;
                                            setForm({ ...form, prompts: arr });
                                        }}
                                        onCancel={() => setEditingPromptIndex(null)}
                                        onSave={() => setEditingPromptIndex(null)}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
