import React, { useEffect } from 'react';
import { useLLMStore } from '../../../stores';
import { useError } from '../../../hooks';
import { MemorySidebar } from './leftside/LeftSidebar';
import { ChatArea } from './rightside/ChatArea';
import './DashboardPage.scss';

export const DashboardPage: React.FC = () => {
    const { loadSets } = useLLMStore();
    const { handleError } = useError();

    // Carregar dados iniciais (apenas LLM sets, memórias são carregadas pelo MemorySidebar)
    useEffect(() => {
        loadSets().catch((err) => {
            handleError(err, 'Carregando configurações LLM');
        });
    }, [loadSets, handleError]);

    return (
        <div className="dashboard-page">
            <div className="dashboard-content">
                <MemorySidebar />
                <ChatArea />
            </div>
        </div>
    );
};
