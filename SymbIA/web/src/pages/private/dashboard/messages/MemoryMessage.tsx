import React from 'react';

interface MemoryMessageProps {
    // Parsed JSON content for memory search modal
    content: any;
    isExpanded: boolean;
    onToggle: () => void;
}

export const MemoryMessage: React.FC<MemoryMessageProps> = ({ content, isExpanded, onToggle }) => {
    const renderMemoryItem = (idx: number) => {
        const m = content.memories[idx];
        const text = m?.content?.value ?? '';
        return (
            <div key={(m?.vectorId || '') + '-' + idx} className="memory-item">
                <div className="memory-keywords">🔎 {m?.keyWords}</div>
                {text && (
                    <div className="memory-content">
                        {String(text)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="memory-content">
            <div className="memory-header" onClick={onToggle}>
                <span className="memory-title">🧠 {content.title}</span>
                <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
            </div>
            {isExpanded && (
                <div className="memory-body">
                    {content.status && (
                        <div className={`memory-status status-${content.status}`}>
                            Status: {content.status}
                        </div>
                    )}
                    {content.explanation && (
                        <div className="memory-explanation">{content.explanation}</div>
                    )}
                    {!!content.error && (
                        <div className="memory-error">{content.error}</div>
                    )}
                    {Array.isArray(content.memories) && content.memories.length > 0 && (
                        <div className="memory-list">
                            {content.memories.map((_: any, i: number) => renderMemoryItem(i))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemoryMessage;
