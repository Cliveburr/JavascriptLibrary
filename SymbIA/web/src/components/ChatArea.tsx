import React from 'react';
import { useMemoryStore } from '../stores';
import './ChatArea.scss';

export const ChatArea: React.FC = () => {
    const { currentMemoryId, memories } = useMemoryStore();

    const currentMemory = memories.find(m => m.id === currentMemoryId);

    return (
        <div className="chat-area">
            <div className="chat-header">
                <h3>{currentMemory ? currentMemory.name : 'Select a memory'}</h3>
            </div>

            <div className="chat-content">
                {currentMemory ? (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">💭</div>
                        <h4>Start a conversation</h4>
                        <p>This is where your chat with the AI will appear. The conversation will be linked to the memory "{currentMemory.name}".</p>
                    </div>
                ) : (
                    <div className="chat-placeholder">
                        <div className="placeholder-icon">🤖</div>
                        <h4>Welcome to SymbIA</h4>
                        <p>Select or create a memory from the sidebar to start chatting with your AI assistant.</p>
                    </div>
                )}
            </div>

            {currentMemory && (
                <div className="chat-input-area">
                    <div className="chat-input-container">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            disabled
                        />
                        <button disabled>Send</button>
                    </div>
                    <div className="input-hint">
                        Chat functionality will be implemented in the next phase
                    </div>
                </div>
            )}
        </div>
    );
};
