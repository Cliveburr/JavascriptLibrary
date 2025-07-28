import React, { useEffect } from 'react';
import { useAuthStore, useMemoryStore } from '../stores';
import { MemorySidebar } from '../components/MemorySidebar';
import { ChatArea } from '../components/ChatArea';
import './DashboardPage.scss';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuthStore();
    const { fetchMemories } = useMemoryStore();

    useEffect(() => {
        fetchMemories();
    }, [fetchMemories]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>SymbIA</h1>
                    <div className="user-info">
                        <span className="user-email">{user?.email}</span>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <MemorySidebar />
                <ChatArea />
            </div>
        </div>
    );
};
