import { create } from 'zustand';
import type { MemoryDTO } from '../types/frontend';
import { useAuthStore } from './auth.store';
import { createApiUrl } from '../config/api';

interface MemoryState {
    memories: MemoryDTO[];
    currentMemoryId: string | null;
    isLoading: boolean;
    error: string | null;
    fetchMemories: () => Promise<void>;
    createMemory: (name: string) => Promise<void>;
    deleteMemory: (id: string) => Promise<void>;
    setCurrentMemory: (id: string) => void;
}

const getAuthToken = () => {
    const authState = useAuthStore.getState();
    return authState.token;
};

const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    // Handle empty responses (like 204 No Content)
    const contentLength = response.headers.get('content-length');
    if (response.status === 204 || contentLength === '0') {
        return null;
    }

    return response.json();
};

export const useMemoryStore = create<MemoryState>((set, get) => ({
    memories: [],
    currentMemoryId: null,
    isLoading: false,
    error: null,

    fetchMemories: async () => {
        try {
            console.log('Iniciando busca de memórias...');
            set({ isLoading: true, error: null });
            const memories = await apiCall(createApiUrl('/memories'));
            console.log('Memórias recebidas:', memories);
            set({ memories, isLoading: false });

            // Set current memory if none is selected
            const { currentMemoryId } = get();
            if (!currentMemoryId && memories.length > 0) {
                console.log('Selecionando primeira memória:', memories[0]?.id);
                set({ currentMemoryId: memories[0]?.id });
            }
        } catch (error) {
            console.error('Erro ao buscar memórias:', error);
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch memories',
                isLoading: false
            });
        }
    }, createMemory: async (name: string) => {
        try {
            set({ isLoading: true, error: null });
            const newMemory = await apiCall(createApiUrl('/memories'), {
                method: 'POST',
                body: JSON.stringify({ name }),
            });

            const { memories } = get();
            set({
                memories: [...memories, newMemory],
                isLoading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to create memory',
                isLoading: false
            });
        }
    },

    deleteMemory: async (id: string) => {
        try {
            const { memories, currentMemoryId } = get();

            // Don't allow deletion if it's the last memory
            if (memories.length <= 1) {
                throw new Error('Cannot delete the last memory');
            }

            set({ isLoading: true, error: null });
            await apiCall(createApiUrl(`/memories/${id}`), {
                method: 'DELETE',
            });

            const updatedMemories = memories.filter(m => m.id !== id);
            const newCurrentMemoryId = currentMemoryId === id
                ? (updatedMemories[0]?.id || null)
                : currentMemoryId;

            set({
                memories: updatedMemories,
                currentMemoryId: newCurrentMemoryId,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to delete memory',
                isLoading: false
            });
        }
    },

    setCurrentMemory: (id: string) => {
        set({ currentMemoryId: id });
    },
}));
