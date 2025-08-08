import React, { useState, useEffect } from 'react';
import { createApiUrl } from '../../config/api';
import { useChatStore, useAuthStore } from '../../stores';
import './ChatDebug.scss';

interface ChatDebugProps {
    onClose: () => void;
}

interface DebugData {
    messages: Array<{
        role: string;
        content: string;
    }>;
    response: string;
}

export const ChatDebug: React.FC<ChatDebugProps> = ({ onClose }) => {
    const { selectedChatId } = useChatStore();
    const { token } = useAuthStore();
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(null);
    const [debugData, setDebugData] = useState<DebugData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDebugData, setLoadingDebugData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load timestamps when component mounts or selectedChatId changes
    useEffect(() => {
        if (selectedChatId) {
            loadTimestamps();
        } else {
            setError('Nenhum chat selecionado');
            setLoading(false);
        }
    }, [selectedChatId]);

    // Load debug data when timestamp is selected
    useEffect(() => {
        if (selectedTimestamp && selectedChatId) {
            loadDebugData(selectedTimestamp);
        } else {
            setDebugData(null);
        }
    }, [selectedTimestamp, selectedChatId]);

    const loadTimestamps = async () => {
        if (!selectedChatId) return;

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(createApiUrl(`/debug?chatId=${selectedChatId}`), {
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const timestamps: string[] = await response.json();
            setTimestamps(timestamps);
        } catch (err) {
            console.error('Erro ao carregar timestamps:', err);
            setError('Erro ao carregar timestamps de debug');
        } finally {
            setLoading(false);
        }
    };

    const loadDebugData = async (timestamp: string) => {
        if (!selectedChatId) return;

        try {
            setLoadingDebugData(true);

            const response = await fetch(createApiUrl(`/debug/${selectedChatId}?timestamp=${encodeURIComponent(timestamp)}`), {
                headers: {
                    'Authorization': `Bearer ${token || ''}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: DebugData = await response.json();
            setDebugData(data);
        } catch (err) {
            console.error('Erro ao carregar dados de debug:', err);
            setError('Erro ao carregar dados de debug');
        } finally {
            setLoadingDebugData(false);
        }
    };

    const formatTimestamp = (timestamp: string) => {
        try {
            return new Date(timestamp).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch {
            return timestamp; // Return original if parsing fails
        }
    };

    const copyDebugDataToClipboard = async () => {
        if (!debugData) return;

        try {
            // Create the JSON structure with messages in sequence and llmResponse at the end
            // const jsonData = {
            //     ...debugData.messages.reduce((acc, message, index) => {
            //         acc[`message_${index + 1}`] = {
            //             role: message.role,
            //             content: message.content
            //         };
            //         return acc;
            //     }, {} as Record<string, any>),
            //     llmResponse: debugData.response
            // };
            const jsonData: any = [
                ...debugData.messages,
                {
                    llmResponse: debugData.response
                }
            ];

            await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));

            // Optional: Show a brief success indication
            console.log('Debug data copied to clipboard');
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            // Fallback: create a temporary textarea
            const textArea = document.createElement('textarea');
            textArea.value = JSON.stringify({
                ...debugData.messages.reduce((acc, message, index) => {
                    acc[`message_${index + 1}`] = {
                        role: message.role,
                        content: message.content
                    };
                    return acc;
                }, {} as Record<string, any>),
                llmResponse: debugData.response
            }, null, 2);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
    };

    return (
        <div className="chat-debug">
            <div className="chat-debug-sidebar">
                <div className="chat-debug-sidebar-header">
                    <h4>Timestamps</h4>
                    <button
                        className="refresh-button"
                        onClick={loadTimestamps}
                        disabled={loading || !selectedChatId}
                        title="Atualizar timestamps"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="m21 3-3 5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="m3 21 3-5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="chat-debug-chat-list">
                    {!selectedChatId ? (
                        <div className="error-state">Nenhum chat selecionado</div>
                    ) : loading ? (
                        <div className="loading-state">Carregando timestamps...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : timestamps.length === 0 ? (
                        <div className="empty-state">Nenhum timestamp encontrado</div>
                    ) : (
                        timestamps.map((timestamp, index) => (
                            <div
                                key={`${timestamp}-${index}`}
                                className={`chat-debug-chat-item ${selectedTimestamp === timestamp ? 'selected' : ''}`}
                                onClick={() => setSelectedTimestamp(timestamp)}
                            >
                                <div className="chat-item-timestamp">{formatTimestamp(timestamp)}</div>
                                {selectedTimestamp === timestamp && debugData && (
                                    <button
                                        className="copy-button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering timestamp selection
                                            copyDebugDataToClipboard();
                                        }}
                                        title="Copiar dados JSON para área de transferência"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.83 2.28A2 2 0 0015.24 2H10a2 2 0 00-2 2z"
                                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2"
                                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="chat-debug-main">
                {!selectedTimestamp ? (
                    <div className="chat-debug-placeholder">
                        <div className="placeholder-icon">�</div>
                        <h4>Selecione um timestamp</h4>
                        <p>Escolha um timestamp na lista ao lado para ver os dados de debug.</p>
                    </div>
                ) : (
                    <div className="chat-debug-content">
                        <div className="chat-debug-messages">
                            <div className="messages-header">
                                <h4>Mensagens</h4>
                                <span className="message-count">
                                    {debugData?.messages?.length || 0} {(debugData?.messages?.length || 0) === 1 ? 'mensagem' : 'mensagens'}
                                </span>
                            </div>

                            <div className="messages-list">
                                {loadingDebugData ? (
                                    <div className="loading-state">Carregando dados de debug...</div>
                                ) : !debugData?.messages?.length ? (
                                    <div className="empty-state">Nenhuma mensagem encontrada</div>
                                ) : (
                                    debugData.messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`message-item ${message.role}`}
                                        >
                                            <div className="message-header">
                                                <span className="message-role">{message.role}</span>
                                            </div>
                                            <div className="message-content">
                                                {message.content}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="chat-debug-response">
                            <div className="response-header">
                                <h4>Response</h4>
                            </div>
                            <div className="response-content">
                                {loadingDebugData ? (
                                    <div className="loading-state">Carregando response...</div>
                                ) : (
                                    debugData?.response || 'Nenhuma response encontrada'
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
