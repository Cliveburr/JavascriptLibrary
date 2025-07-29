import React, { useState, useRef, useEffect } from 'react';
import { useLLMStore } from '../stores';
import './LLMSelector.scss';

export const LLMSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {
        availableModels,
        selectedModelId,
        isLoading,
        error,
        loadModels,
        setSelectedModel
    } = useLLMStore();

    // Carregar modelos na inicialização
    useEffect(() => {
        if (availableModels.length === 0) {
            loadModels();
        }
    }, [availableModels.length, loadModels]);

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedModel = availableModels.find(model => model.id === selectedModelId);

    const handleModelSelect = (modelId: string) => {
        setSelectedModel(modelId);
        setIsOpen(false);
    };

    const getProviderIcon = (provider: string) => {
        switch (provider.toLowerCase()) {
            case 'openai':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path
                            d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'anthropic':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path
                            d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
                            fill="currentColor"
                        />
                    </svg>
                );
            case 'ollama':
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                            fill="currentColor"
                        />
                    </svg>
                );
            default:
                return (
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill="currentColor"
                        />
                    </svg>
                );
        }
    };

    if (error) {
        return (
            <div className="llm-selector error">
                <span>Erro ao carregar modelos</span>
            </div>
        );
    }

    return (
        <div className="llm-selector" ref={dropdownRef}>
            <button
                className="llm-selector-trigger"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                aria-expanded={isOpen}
            >
                {isLoading ? (
                    <div className="loading-spinner">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path
                                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                                opacity=".25"
                                fill="currentColor"
                            />
                            <path
                                d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                ) : (
                    <>
                        {selectedModel && (
                            <>
                                {getProviderIcon(selectedModel.provider)}
                                <span className="model-name">{selectedModel.name}</span>
                            </>
                        )}
                        <svg
                            className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                        >
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </>
                )}
            </button>

            {isOpen && !isLoading && (
                <div className="llm-dropdown-menu">
                    <div className="dropdown-header">
                        <span>Selecionar Modelo LLM</span>
                    </div>

                    {availableModels.map((model) => (
                        <button
                            key={model.id}
                            className={`model-option ${selectedModelId === model.id ? 'selected' : ''}`}
                            onClick={() => handleModelSelect(model.id)}
                        >
                            <div className="model-info">
                                <div className="model-header">
                                    {getProviderIcon(model.provider)}
                                    <span className="model-name">{model.name}</span>
                                    {selectedModelId === model.id && (
                                        <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16">
                                            <path
                                                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="model-meta">
                                    <span className="provider">{model.provider}</span>
                                    {model.description && (
                                        <span className="description">{model.description}</span>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
