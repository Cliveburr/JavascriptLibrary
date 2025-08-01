import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LlmSetConfig, LlmSetListResponse } from '../types/llm';
import { useAuthStore } from './auth.store';
import { createApiUrl } from '../config/api';

interface LLMState {
    availableSets: LlmSetConfig[];
    selectedSetId: string | null;
    isLoading: boolean;
    error: string | null;
    loadSets: () => Promise<void>;
    setSelectedSet: (setId: string) => void;
}

// Helper to get auth token (for future API integration)
const getAuthToken = () => {
    const authState = useAuthStore.getState();
    return authState.token;
};

// Helper for API calls
const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
};

export const useLLMStore = create<LLMState>()(
    persist(
        (set, get) => ({
            availableSets: [],
            selectedSetId: null,
            isLoading: false,
            error: null,

            loadSets: async () => {
                try {
                    set({ isLoading: true, error: null });

                    // Call the real API endpoint
                    const response: LlmSetListResponse = await apiCall(createApiUrl('/llm-sets'));

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
            }
        }),
        {
            name: 'llm-storage',
            partialize: (state) => ({
                selectedSetId: state.selectedSetId,
            }),
        }
    )
);
