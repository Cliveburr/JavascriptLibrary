import React from 'react';
import { LeftHeader } from './LeftHeader';
import { MemorySection } from './MemorySection';
import { ChatSection } from './ChatSection';

export const MemorySidebar: React.FC = () => {
    return (
        <div className="flex flex-col gap-sm p-sm" style={{ width: 280, minWidth: 280, maxWidth: 280, height: '100vh', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}>
            <LeftHeader />
            <MemorySection />
            <ChatSection />
        </div>
    );
};
