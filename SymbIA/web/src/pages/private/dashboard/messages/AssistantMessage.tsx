import React from 'react';
import './ChatMessage.scss';
import { FrontendChatIterationAssistantDTO } from '../../../../types';
import { contentCast } from '../../../../utils';
import { MemoryMessage } from './MemoryMessage';

interface ChatMessageProps {
    message: FrontendChatIterationAssistantDTO;
}

export const AssistantMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isReflection = message.modal === 'reflection';
    const isMemory = message.modal === 'memory_search';


    const isExpanded = message.isExpanded ?? false;

    const toggleExpanded = () => {
        message.isExpanded = !isExpanded;
    };

    const renderContent = () => {
        if (!message.content) {
            return null;
        }

        if (contentCast.isText(message, message.content) && typeof message.content === 'string') {
            return <div className="message-text">{message.content}</div>;
        }

        if (contentCast.isReflection(message, message.content)) {
            // Defensive: backend may stream partial objects, ensure we have a string
            const reflectionContent = (typeof message.content === 'object' && message.content && typeof (message.content as any).content === 'string')
                ? (message.content as any).content
                : '';
            const previewContent = reflectionContent.length > 60
                ? reflectionContent.substring(0, 60) + '...'
                : reflectionContent;

            return (
                <div className="reflection-content">
                    <div
                        className="reflection-header"
                        onClick={toggleExpanded}
                    >
                        <span className="reflection-title">
                            💭 {isExpanded ? reflectionContent : previewContent}
                        </span>
                        <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
                    </div>
                </div>
            );
        }

        if (contentCast.isMemory(message, message.content) && typeof message.content === 'object' && message.content) {
            return (
                <div className="memory-wrapper">
                    <MemoryMessage content={message.content} isExpanded={isExpanded} onToggle={toggleExpanded} />
                </div>
            );
        }

        return <div className="message-text">{String(message.content)}</div>;
    };

    const isUser = !isReflection && !isMemory && message.modal === 'text' && typeof message.content === 'string' && !message.inPrepare;

    return (
        <div className={`chat-message ${isUser ? 'user' : 'assistant'} ${isReflection ? 'reflection' : ''} ${isReflection && !isExpanded ? 'reflection-collapsed' : ''} ${isMemory ? 'memory' : ''} ${isMemory && !isExpanded ? 'memory-collapsed' : ''}`} data-testid="message">
            <div className="message-content">
                {renderContent()}
            </div>
        </div>
    );
};
