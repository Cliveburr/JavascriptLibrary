import React from 'react';

interface MemoryStringContentProps {
    text?: string;
}

export const MemoryStringContent: React.FC<MemoryStringContentProps> = ({ text }) => {
    if (!text) return null;
    return (
        <div className="memory-string-content">
            {text}
        </div>
    );
};

export default MemoryStringContent;
