import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Dashboard = () => {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="columns is-gapless fullheight-container">
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
                            <button className="button is-small is-text">
                                <span className="icon">
                                    <i className="fas fa-plus"></i>
                                </span>
                            </button>
                        </p>
                        <ul className="menu-list">
                            {/* Adicionar itens de memória aqui */}
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
        </div>
    );
};

export default Dashboard;
