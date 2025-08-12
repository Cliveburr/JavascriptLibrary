import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLLMStore } from '../../../../stores';
import { useError } from '../../../../hooks';
import type { LlmSetIcon } from '../../../../types/llm';

export const LLMSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { handleError } = useError();
    const {
        availableSets,
        selectedSetId,
        isLoading,
        loadSets,
        setSelectedSet
    } = useLLMStore();

    // Load sets on initialization
    useEffect(() => {
        if (availableSets.length === 0) {
            loadSets().catch((err) => {
                handleError(err, 'Carregando configurações LLM');
            });
        }
    }, [availableSets.length, loadSets, handleError]);

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

    const handleSetSelect = useCallback((setId: string) => {
        setSelectedSet(setId);
        setIsOpen(false);
    }, [setSelectedSet]);

    const renderIcon = useCallback((icon: LlmSetIcon, size = 16) => {
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
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button
                className="btn btn-outline inline-flex items-center gap-sm"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                aria-expanded={isOpen}
            >
                {isLoading ? (
                    <div className="spinner sm">
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
                                <span className="ml-sm">{selectedSet.display}</span>
                            </>
                        )}
                        <svg
                            className={`ml-sm ${isOpen ? 'rotate-180' : ''}`}
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
                <div className="dropdown-menu">
                    <div className="dropdown-header px-sm py-sm border-b">
                        <span>Selecionar Conjunto LLM</span>
                    </div>

                    {availableSets.map((set) => {
                        return (
                            <button
                                key={set.id}
                                className={`dropdown-item w-100 ${selectedSetId === set.id ? 'selected' : ''}`}
                                onClick={() => handleSetSelect(set.id)}
                            >
                                <div className="flex items-center gap-sm w-100">
                                    {renderIcon(set.icon)}
                                    <span className="ml-sm flex-1 text-primary">{set.display}</span>
                                    {selectedSetId === set.id && (
                                        <svg className="ml-sm" width="16" height="16" viewBox="0 0 16 16">
                                            <path
                                                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                    {set.info && (
                                        <span className="block text-tertiary text-sm">{set.info}</span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
