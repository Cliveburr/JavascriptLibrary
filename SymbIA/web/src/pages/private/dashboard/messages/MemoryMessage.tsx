import React from 'react';
import { MessageMemoryModal, VectorContentType } from '../../../../types';
import { MemoryStringContent } from './memories/MemoryStringContent';

interface MemoryMessageProps {
    content: MessageMemoryModal;
    isExpanded: boolean;
    onToggle: () => void;
}

export const MemoryMessage: React.FC<MemoryMessageProps> = ({ content, isExpanded, onToggle }) => {
    const renderMemoryItem = (idx: number) => {
        const m = content.memories[idx];
        return (
            <div key={(m.vectorId || '') + '-' + idx} className="memory-item">
                <div className="memory-keywords">🔎 {m.keyWords}</div>
                {m.content && m.content.type === VectorContentType.PlainText && (
                    <div className="memory-content">
                        <MemoryStringContent text={String(m.content.value)} />
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
                        <div className="memory-explanation">
                            <MemoryStringContent text={content.explanation} />
                        </div>
                    )}
                    {!!content.error && (
                        <div className="memory-error">{content.error}</div>
                    )}
                    {Array.isArray(content.memories) && content.memories.length > 0 && (
                        <div className="memory-list">
                            {content.memories.map((_, i) => renderMemoryItem(i))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MemoryMessage;
