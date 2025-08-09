import React from 'react';
import './ChatMessage.scss';
import { ChatStreamMessage } from '../../../types';
import { contentCast } from '../../../utils';
import { useMessageStore } from '../../../stores/message.store';
import { MemoryMessage } from './messages/MemoryMessage';

interface ChatMessageProps {
    message: ChatStreamMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const { updateMessage } = useMessageStore();

    const isUser = message.role === 'user';
    const isSystem = message.role === 'assistant' && message.modal === 'text' && typeof message.content === 'string' && message.content.startsWith('[SYSTEM]');
    const isStreaming = 'isStreaming' in message && message.isStreaming;
    const isError = 'isError' in message && message.isError;
    const isReflection = message.modal === 'reflection';
    const isMemory = message.modal === 'memory';

    const isExpanded = message.isExpanded ?? false;

    const toggleExpanded = () => {
        if (message.messageId) {
            updateMessage(message.messageId, { isExpanded: !isExpanded });
        }
    };

    const renderContent = () => {
        if (!message.content) {
            return null;
        }

        if (contentCast.isText(message, message.content)) {
            return <div className="message-text">{message.content}</div>;
        }

        if (contentCast.isReflection(message, message.content)) {
            const reflectionContent = message.content.content;
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

        if (contentCast.isMemory(message, message.content)) {
            return (
                <div className="memory-wrapper">
                    <MemoryMessage content={message.content} isExpanded={isExpanded} onToggle={toggleExpanded} />
                </div>
            );
        }

        return <div className="message-text">{String(message.content)}</div>;
    };

    return (
        <div
            className={`chat-message ${isUser ? 'user' : isSystem ? 'system' : 'assistant'} ${isStreaming ? 'streaming' : ''} ${isError ? 'error' : ''} ${isReflection ? 'reflection' : ''} ${isReflection && !isExpanded ? 'reflection-collapsed' : ''} ${isMemory ? 'memory' : ''} ${isMemory && !isExpanded ? 'memory-collapsed' : ''}`}
            data-testid="message"
            data-role={message.role}
        >
            <div className="message-content">
                {renderContent()}
            </div>
        </div>
    );
};
