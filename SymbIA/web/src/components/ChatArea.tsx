import React, { useEffect } from 'react';
import { useMemoryStore } from '../stores';
import { useChatStore } from '../stores/chat.store';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import './ChatArea.scss';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();
    const { clearMessages } = useChatStore();

    const currentMemory = memories.find(m => m.id === currentMemoryId);

    // Clear messages when switching memories
    useEffect(() => {
        clearMessages();
    }, [currentMemoryId, clearMessages]);

    return (
        <div className="chat-area">
            <div className="chat-header">
                <h3>{currentMemory ? currentMemory.name : 'Select a memory'}</h3>
            </div>

            <div className="chat-content">
                {currentMemory ? (
                    <>
                        <ChatWindow memoryId={currentMemory.id} />
                        <ChatInput memoryId={currentMemory.id} />
                    </>
                ) : (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">🤖</div>
                        <h4>Welcome to SymbIA</h4>
                        <p>Select or create a memory from the sidebar to start chatting with your AI assistant.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
