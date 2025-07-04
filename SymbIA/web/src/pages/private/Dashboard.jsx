import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import ExecutionPlanner from '../../components/ExecutionPlanner';
import MessageDecomposer from '../../components/MessageDecomposer';
import PipelineExecutor from '../../components/PipelineExecutor';
import ThoughtCycleTester from '../../components/ThoughtCycleTester';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('execution-planner');
    const { user, logout } = useApp();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const tabs = [
        { id: 'execution-planner', label: 'Planejador de Execução', component: ExecutionPlanner },
        { id: 'message-decomposer', label: 'Decompositor de Mensagens', component: MessageDecomposer },
        { id: 'pipeline-executor', label: 'Executor de Pipeline', component: PipelineExecutor },
        { id: 'thought-cycle', label: 'Testador de Ciclo de Pensamento', component: ThoughtCycleTester }
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ExecutionPlanner;

    return (
        <div className="is-fullheight">
            {/* Navbar */}
            <nav className="navbar is-primary" role="navigation">
                <div className="navbar-brand">
                    <Link className="navbar-item" to="/">
                        <strong>SymbIA</strong>
                    </Link>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <span className="has-text-white mr-3">
                                Olá, {user?.name || 'Usuário'}!
                            </span>
                        </div>
                        <div className="navbar-item">
                            <div className="buttons">
                                <button 
                                    className="button is-light"
                                    onClick={handleLogout}
                                >
                                    <span className="icon">
                                        <i className="fas fa-sign-out-alt"></i>
                                    </span>
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero is-primary">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">Dashboard</h1>
                        <h2 className="subtitle">
                            Bem-vindo ao painel de controle do SymbIA
                        </h2>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="container mt-4">
                <div className="tabs is-boxed is-medium">
                    <ul>
                        {tabs.map(tab => (
                            <li key={tab.id} className={activeTab === tab.id ? 'is-active' : ''}>
                                <a onClick={() => setActiveTab(tab.id)}>
                                    <span>{tab.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="box">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
