import React from 'react';
import { LeftHeader } from './LeftHeader';
import { MemorySection } from './MemorySection';
import { ChatSection } from './ChatSection';
import './LeftSidebar.scss';

export const MemorySidebar: React.FC = () => {
    return (
        <div className="memory-sidebar">
            <LeftHeader />
            <MemorySection />
            <ChatSection />
        </div>
    );
};
