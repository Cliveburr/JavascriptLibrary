import React from 'react';
import { FrontendChatIterationAssistantDTO } from '../../../../types';
import { MemoryMessage } from './MemoryMessage';
import { ReplyMessage } from './ReplyMessage';
import { ReflectionMessage } from './ReflectionMessage';

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
        if (!message.content) return null;

        switch (message.modal) {
            case 'reply':
                return <ReplyMessage content={message.content} />;
            case 'reflection': {
                const reflectionText = String(message.content);
                return (
                    <ReflectionMessage content={reflectionText} isExpanded={isExpanded} onToggle={toggleExpanded} />
                );
            }
            case 'memory_search': {
                // message.content is expected to be a serialized JSON string for memory modal
                let parsed: any = null;
                try { parsed = JSON.parse(message.content); } catch { }
                if (!parsed || typeof parsed !== 'object') {
                    return <div className="chat-bubble chat-bubble--assistant">{message.content}</div>;
                }
                return (
                    <div className="memory-wrapper">
                        <MemoryMessage content={parsed} isExpanded={isExpanded} onToggle={toggleExpanded} />
                    </div>
                );
            }
            default:
                return <div className="chat-bubble chat-bubble--assistant">{String(message.content)}</div>;
        }
    };
    // Assistant messages are always rendered on the left in this component
    const isUser = false;

    return (
        <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'} ${isReflection ? 'chat-reflection' : ''} ${isReflection && !isExpanded ? 'chat-reflection--collapsed' : ''} ${isMemory ? 'chat-memory' : ''} ${isMemory && !isExpanded ? 'chat-memory--collapsed' : ''}`} data-testid="message">
            <div className="chat-message__content">
                {renderContent()}
            </div>
        </div>
    );
};

// Backwards-compatible alias expected by components/index.ts
export const ChatMessage = AssistantMessage;
