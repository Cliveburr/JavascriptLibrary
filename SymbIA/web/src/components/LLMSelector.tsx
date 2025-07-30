import React, { useState, useRef, useEffect } from 'react';
import { useLLMStore } from '../stores';
import type { LlmSetIcon } from '../types/llm';
import './LLMSelector.scss';

export const LLMSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {
        availableSets,
        selectedSetId,
        isLoading,
        error,
        loadSets,
        setSelectedSet
    } = useLLMStore();

    // Load sets on initialization
    useEffect(() => {
        if (availableSets.length === 0) {
            loadSets();
        }
    }, [availableSets.length, loadSets]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedSet = availableSets.find(set => set.id === selectedSetId);

    const handleSetSelect = (setId: string) => {
        setSelectedSet(setId);
        setIsOpen(false);
    };

    const renderIcon = (icon: LlmSetIcon, size = 16) => {
        switch (icon.type) {
            case 'emoji':
                return (
                    <span
                        className="icon-emoji"
                        style={{ fontSize: size, color: icon.fill }}
                    >
                        {icon.emoji}
                    </span>
                );
            case 'path':
                return (
                    <svg width={size} height={size} viewBox={icon.viewBox || "0 0 24 24"}>
                        <path
                            d={icon.d}
                            fill={icon.fill || "currentColor"}
                        />
                    </svg>
                );
            case 'svg':
                return (
                    <div
                        dangerouslySetInnerHTML={{ __html: icon.svg || '' }}
                        style={{ width: size, height: size }}
                    />
                );
            default:
                return (
                    <svg width={size} height={size} viewBox="0 0 24 24">
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
                <span>Erro ao carregar conjuntos LLM</span>
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
                        {selectedSet && (
                            <>
                                {renderIcon(selectedSet.icon)}
                                <span className="model-name">{selectedSet.display}</span>
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
                        <span>Selecionar Conjunto LLM</span>
                    </div>

                    {availableSets.map((set) => {
                        return (
                            <button
                                key={set.id}
                                className={`model-option ${selectedSetId === set.id ? 'selected' : ''}`}
                                onClick={() => handleSetSelect(set.id)}
                            >
                                <div className="model-info">
                                    <div className="model-header">
                                        {renderIcon(set.icon)}
                                        <span className="model-name">{set.display}</span>
                                        {selectedSetId === set.id && (
                                            <svg className="check-icon" width="16" height="16" viewBox="0 0 16 16">
                                                <path
                                                    d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="model-meta">
                                        {set.info && (
                                            <span className="description">{set.info}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
