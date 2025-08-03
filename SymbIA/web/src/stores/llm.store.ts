import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LlmSetConfig, LlmSetListResponse } from '../types/llm';
import { apiService } from '../utils/apiService';

interface LLMState {
    availableSets: LlmSetConfig[];
    selectedSetId: string | null;
    isLoading: boolean;
    loadSets: () => Promise<void>;
    setSelectedSet: (setId: string) => void;
}

export const useLLMStore = create<LLMState>()(
    persist(
        (set, get) => {
            return {
                availableSets: [],
                selectedSetId: null,
                isLoading: false,

                loadSets: async () => {
                    set({ isLoading: true });
                    try {
                        // Call the real API endpoint
                        const response: LlmSetListResponse = await apiService.llm.fetchSets();

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
                        set({ isLoading: false });
                        throw error;
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
