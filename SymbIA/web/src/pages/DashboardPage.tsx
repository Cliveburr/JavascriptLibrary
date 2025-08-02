import React, { useEffect } from 'react';
import { useAuthStore, useMemoryStore, useLLMStore } from '../stores';
import { MemorySidebar } from '../components/MemorySidebar';
import { ChatArea } from '../components/ChatArea';
import './DashboardPage.scss';

export const DashboardPage: React.FC = () => {
    const { lastSelectedMemoryId, isAuthenticated, autoLoginDev } = useAuthStore();
    const { fetchMemories, setCurrentMemory } = useMemoryStore();
    const { loadSets } = useLLMStore();

    // Auto login para desenvolvimento
    useEffect(() => {
        if (!isAuthenticated) {
            console.log('Usuário não autenticado, fazendo login automático...');
            autoLoginDev().then(() => {
                console.log('Login automático concluído');
            }).catch((error) => {
                console.error('Erro no login automático:', error);
            });
        } else {
            console.log('Usuário já autenticado');
        }
    }, [isAuthenticated, autoLoginDev]);

    useEffect(() => {
        // Carregar dados iniciais apenas se autenticado
        if (isAuthenticated) {
            console.log('Carregando memórias e conjuntos LLM...');
            fetchMemories();
            loadSets();
        } else {
            console.log('Aguardando autenticação...');
        }
    }, [isAuthenticated, fetchMemories, loadSets]);

    // Restaurar última seleção quando os dados estiverem carregados
    useEffect(() => {
        if (lastSelectedMemoryId) {
            setCurrentMemory(lastSelectedMemoryId);
            // O chat será selecionado automaticamente pelo MemorySidebar
        }
    }, [lastSelectedMemoryId, setCurrentMemory]);

    return (
        <div className="dashboard-page">
            <div className="dashboard-content">
                <MemorySidebar />
                <ChatArea />
            </div>
        </div>
    );
};
