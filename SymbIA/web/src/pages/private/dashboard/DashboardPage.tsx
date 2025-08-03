import React, { useEffect } from 'react';
import { useMemoryStore, useLLMStore } from '../../../stores';
import { MemorySidebar } from './MemorySidebar';
import { ChatArea } from './ChatArea';
import './DashboardPage.scss';

export const DashboardPage: React.FC = () => {
    const { setCurrentMemory, lastSelectedMemoryId } = useMemoryStore();
    const { loadSets } = useLLMStore();

    // Carregar dados iniciais (apenas LLM sets, memórias são carregadas pelo MemorySidebar)
    useEffect(() => {
        loadSets();
    }, [loadSets]);

    // Restaurar última seleção quando os dados estiverem carregados
    useEffect(() => {
        if (lastSelectedMemoryId) {
            setCurrentMemory(lastSelectedMemoryId);
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
