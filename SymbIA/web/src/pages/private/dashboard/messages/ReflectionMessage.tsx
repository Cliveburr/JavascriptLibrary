import React from 'react';

interface ReflectionMessageProps {
    content: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export const ReflectionMessage: React.FC<ReflectionMessageProps> = ({ content, isExpanded, onToggle }) => {
    const preview = content.length > 80 ? content.slice(0, 80) + '…' : content;
    return (
        <div className={`reflection-content ${isExpanded ? 'expanded' : 'collapsed'}`} data-testid="assistant-reflection">
            <div className="reflection-header" onClick={onToggle} role="button" aria-expanded={isExpanded}>
                <span className="reflection-title">💭 {isExpanded ? content : preview}</span>
                <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
            </div>
        </div>
    );
};

export default ReflectionMessage;
