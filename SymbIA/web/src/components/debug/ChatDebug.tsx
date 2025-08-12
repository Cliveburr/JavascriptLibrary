import React, { useState, useEffect } from 'react';
import { createApiUrl } from '../../config/api';
import { useChatStore, useAuthStore } from '../../stores';
// using framework utilities in a future step

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
        <div className="flex min-h-0" style={{ background: 'var(--panel-bg, #1a1a1a)' }}>
            {/* Sidebar */}
            <div
                className="flex flex-col border-r"
                style={{ width: 300, minWidth: 300, borderColor: 'var(--border-color, #333)', background: 'var(--sidebar-bg, rgba(0, 0, 0, 0.2))' }}
            >
                <div className="flex items-center justify-between px-sm py-xs border-b" style={{ borderColor: 'var(--border-color, #333)', background: 'var(--header-bg, rgba(0, 0, 0, 0.2))' }}>
                    <h4 className="m-0 text-sm font-semibold text-primary">Timestamps</h4>
                    <button
                        className="btn btn-outline btn-sm"
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

                <div className="flex-1 overflow-y-auto p-xs">
                    {!selectedChatId ? (
                        <div className="py-sm text-center text-tertiary text-xs">Nenhum chat selecionado</div>
                    ) : loading ? (
                        <div className="py-sm text-center text-tertiary text-xs">Carregando timestamps...</div>
                    ) : error ? (
                        <div className="py-sm text-center text-error text-xs">{error}</div>
                    ) : timestamps.length === 0 ? (
                        <div className="empty-state">Nenhum timestamp encontrado</div>
                    ) : (
                        timestamps.map((timestamp, index) => {
                            const isSelected = selectedTimestamp === timestamp;
                            return (
                                <div
                                    key={`${timestamp}-${index}`}
                                    className={`flex items-center justify-between p-xs mb-xxs rounded-sm border ${isSelected ? 'border-primary bg-accent' : 'bg-surface-2'}`}
                                    onClick={() => setSelectedTimestamp(timestamp)}
                                >
                                    <div className="text-primary text-xs leading-tight flex-1">{formatTimestamp(timestamp)}</div>
                                    {isSelected && debugData && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
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
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {!selectedTimestamp ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-md">
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: .6 }}>💬</div>
                        <h4 className="m-0 mb-xxs text-primary text-md font-medium">Selecione um timestamp</h4>
                        <p className="m-0 text-secondary text-sm">Escolha um timestamp na lista ao lado para ver os dados de debug.</p>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex flex-col min-h-0 border-b" style={{ flex: 2, borderColor: 'var(--border-color, #333)' }}>
                            <div className="flex items-center justify-between px-sm py-xs border-b" style={{ borderColor: 'var(--border-color, #333)', background: 'var(--header-bg, rgba(0, 0, 0, 0.2))' }}>
                                <h4 className="m-0 text-sm font-semibold text-primary">Mensagens</h4>
                                <span className="text-xs text-tertiary bg-surface-2 px-xs py-xxs rounded-full">
                                    {debugData?.messages?.length || 0} {(debugData?.messages?.length || 0) === 1 ? 'mensagem' : 'mensagens'}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto p-xs">
                                {loadingDebugData ? (
                                    <div className="py-sm text-center text-tertiary text-xs">Carregando dados de debug...</div>
                                ) : !debugData?.messages?.length ? (
                                    <div className="empty-state">Nenhuma mensagem encontrada</div>
                                ) : (
                                    debugData.messages.map((message, index) => {
                                        let style: React.CSSProperties | undefined;
                                        if (message.role === 'user') {
                                            style = {
                                                background: 'var(--user-message-bg, rgba(0, 122, 204, 0.1))',
                                                borderColor: 'var(--accent-color, #007acc)'
                                            } as React.CSSProperties;
                                        } else if (message.role === 'assistant') {
                                            style = {
                                                background: 'var(--assistant-message-bg, rgba(0, 0, 0, 0.2))',
                                                borderColor: 'var(--border-color, #333)'
                                            } as React.CSSProperties;
                                        } else if (message.role === 'system') {
                                            style = {
                                                background: 'var(--system-message-bg, rgba(255, 193, 7, 0.1))',
                                                borderColor: '#ffc107'
                                            } as React.CSSProperties;
                                        }

                                        return (
                                            <div key={index} className="mb-xs p-xs rounded-sm border" style={style}>
                                                <div className="flex items-center justify-between mb-xxs">
                                                    <span className="text-xs font-semibold uppercase tracking-wide px-xxs py-xxs rounded-sm bg-surface-2 text-primary">{message.role}</span>
                                                </div>
                                                <div className="text-sm leading-snug text-primary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                                    {message.content}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="px-sm py-xs border-b" style={{ borderColor: 'var(--border-color, #333)', background: 'var(--header-bg, rgba(0, 0, 0, 0.2))' }}>
                                <h4 className="m-0 text-sm font-semibold text-primary">Response</h4>
                            </div>
                            <div className="flex-1 p-sm overflow-y-auto text-sm leading-relaxed text-primary" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: 'var(--response-bg, rgba(0, 0, 0, 0.1))' }}>
                                {loadingDebugData ? (
                                    <div className="py-sm text-center text-tertiary text-xs">Carregando response...</div>
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
