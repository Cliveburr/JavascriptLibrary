import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LlmSetConfig, LlmSetListResponse } from '../types/llm';
import { useApi } from '../hooks/useApi';

interface LLMState {
    availableSets: LlmSetConfig[];
    selectedSetId: string | null;
    isLoading: boolean;
    error: string | null;
    loadSets: () => Promise<void>;
    setSelectedSet: (setId: string) => void;
}

export const useLLMStore = create<LLMState>()(
    persist(
        (set, get) => {
            const api = useApi();

            return {
                availableSets: [],
                selectedSetId: null,
                isLoading: false,
                error: null,

                loadSets: async () => {
                    try {
                        set({ isLoading: true, error: null });

                        // Call the real API endpoint
                        const response: LlmSetListResponse = await api.llm.fetchSets();

                        set({
                            availableSets: response.sets,
                            isLoading: false
                        });

                        // Select first set if none is selected
                        const { selectedSetId } = get();
                        if (!selectedSetId && response.sets.length > 0) {
                            set({ selectedSetId: response.sets[0]?.id });
                        }

                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : 'Failed to load LLM sets',
                            isLoading: false
                        });
                    }
                },

                setSelectedSet: (setId: string) => {
                    set({ selectedSetId: setId });
                },
            };
        },
        {
            name: 'llm-storage',
            partialize: (state) => ({
                selectedSetId: state.selectedSetId,
            }),
        }
    )
);
