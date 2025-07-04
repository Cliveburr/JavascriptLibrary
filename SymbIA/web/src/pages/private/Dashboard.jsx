import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ConfirmModal from '../../components/ConfirmModal';
import QuestionModal from '../../components/QuestionModal';

const Dashboard = () => {
    const { 
        user, 
        logout, 
        memories, 
        selectedMemory, 
        loadMemories, 
        createMemory, 
        deleteMemory, 
        selectMemory,
        setError,
        clearError,
        error 
    } = useApp();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [memoryToDelete, setMemoryToDelete] = useState(null);
    const [newMemoryName, setNewMemoryName] = useState('');
    const [isCreatingMemory, setIsCreatingMemory] = useState(false);

    useEffect(() => {
        // Carregar memórias quando o componente montar
        if (user) {
            loadMemories();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCreateMemory = async () => {
        if (!newMemoryName.trim()) {
            setError('Nome da memória é obrigatório');
            return;
        }

        setIsCreatingMemory(true);
        try {
            await createMemory(newMemoryName.trim());
            setNewMemoryName('');
            setShowCreateMemoryModal(false);
            clearError();
        } catch (error) {
            // Erro já tratado no contexto
        } finally {
            setIsCreatingMemory(false);
        }
    };

    const handleDeleteConfirm = (memory) => {
        setMemoryToDelete(memory);
        setShowDeleteConfirmModal(true);
    };

    const handleDeleteMemory = async () => {
        if (!memoryToDelete) return;

        try {
            await deleteMemory(memoryToDelete._id);
            setShowDeleteConfirmModal(false);
            setMemoryToDelete(null);
            clearError();
        } catch (error) {
            // Erro já tratado no contexto
            setShowDeleteConfirmModal(false);
            setMemoryToDelete(null);
        }
    };

    const handleSelectMemory = (memory) => {
        selectMemory(memory);
    };

    return (
        <div className="columns is-gapless fullheight-container">
            {/* Notificação de erro */}
            {error && (
                <div className="notification is-danger" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
                    <button className="delete" onClick={clearError}></button>
                    {error}
                </div>
            )}
            
            {/* Barra Lateral */}
            <aside 
                className="column is-narrow is-flex is-flex-direction-column"
                style={{ width: '245px', backgroundColor: '#f5f5f5', overflowY: 'auto', height: '100vh' }}
            >
                <div className="p-4 is-flex-grow-1">
                    {/* Logo */}
                    <a className="button is-text has-text-black is-fullwidth is-justify-content-flex-start mb-4">
                        <span className="icon is-medium">
                            {/* Substituir pelo seu logo de 36x36px */}
                            <i className="fas fa-brain fa-2x"></i>
                        </span>
                        <span className="is-size-5 has-text-weight-bold">SymbIA</span>
                    </a>

                    {/* Perfil do Usuário */}
                    <a className="button is-text has-text-black is-fullwidth is-justify-content-flex-start mb-5">
                        <span className="icon">
                            {/* Ícone do usuário 24x24px */}
                            <i className="fas fa-user-circle fa-lg"></i>
                        </span>
                        <span>{user?.name || 'Usuário'}</span>
                    </a>

                    {/* Lista de Memórias */}
                    <div className="menu">
                        <p className="menu-label is-flex is-justify-content-space-between is-align-items-center">
                            Memories
                            <button 
                                className="button is-small is-text"
                                onClick={() => setShowCreateMemoryModal(true)}
                                title="Criar nova memória"
                            >
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </p>
                        <ul className="menu-list">
                            {memories.map((memory) => (
                                <li key={memory._id}>
                                    <a 
                                        className={`is-flex is-justify-content-space-between is-align-items-center ${
                                            selectedMemory?._id === memory._id ? 'is-active' : ''
                                        }`}
                                        onClick={() => handleSelectMemory(memory)}
                                    >
                                        <span className="is-flex-grow-1">{memory.name}</span>
                                        {!memory.isDefault && (
                                            <button 
                                                className="button is-small is-text has-text-danger"
                                                style={{ width: 'auto', padding: '0.25rem', flexShrink: 0 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteConfirm(memory);
                                                }}
                                                title="Excluir memória"
                                            >
                                                <span className="icon is-small">
                                                    <i className="fas fa-trash"></i>
                                                </span>
                                            </button>
                                        )}
                                    </a>
                                </li>
                            ))}
                            {memories.length === 0 && (
                                <li>
                                    <span className="has-text-grey">Nenhuma memória encontrada</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Lista de Chats */}
                    <div className="menu mt-4">
                        <p className="menu-label is-flex is-justify-content-space-between is-align-items-center">
                            Chats
                            <button className="button is-small is-text">
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </p>
                        <ul className="menu-list">
                            {/* Adicionar itens de chat aqui */}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Conteúdo Principal */}
            <main className="column">
                <div className="is-flex is-flex-direction-column" style={{ height: '100vh' }}>
                    {/* Histórico da Conversa */}
                    <div className="is-flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                        {/* As mensagens da conversa irão aqui */}
                    </div>

                    {/* Área de Input */}
                    <div className="p-4">
                        <div className="box">
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <input 
                                        className="input is-medium" 
                                        type="text" 
                                        placeholder="Digite sua pergunta..."
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="control">
                                    <button 
                                        className={`button is-primary is-medium ${isProcessing ? 'is-loading' : ''}`}
                                        onClick={() => setIsProcessing(!isProcessing)} // Lógica de exemplo
                                    >
                                        <span className="icon">
                                            <i className={`fas ${isProcessing ? 'fa-pause' : 'fa-paper-plane'}`}></i>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal para criar nova memória */}
            <QuestionModal
                isOpen={showCreateMemoryModal}
                onClose={() => setShowCreateMemoryModal(false)}
                onConfirm={handleCreateMemory}
                title="Nova Memória"
                label="Nome da Memória"
                placeholder="Digite o nome da memória..."
                value={newMemoryName}
                onChange={(e) => setNewMemoryName(e.target.value)}
                confirmText="Criar"
                cancelText="Cancelar"
                isLoading={isCreatingMemory}
                onKeyPress={handleCreateMemory}
            />

            {/* Modal de confirmação para excluir memória */}
            <ConfirmModal
                isOpen={showDeleteConfirmModal}
                onClose={() => setShowDeleteConfirmModal(false)}
                onConfirm={handleDeleteMemory}
                title="Excluir Memória"
                message={`Tem certeza que deseja excluir a memória "${memoryToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                confirmClass="is-danger"
            />
        </div>
    );
};

export default Dashboard;
