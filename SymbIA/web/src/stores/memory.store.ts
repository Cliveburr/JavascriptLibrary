import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemoryDTO } from '../types/frontend';
import { useApi } from '../hooks/useApi';

interface MemoryState {
    memories: MemoryDTO[];
    currentMemoryId: string | null;
    lastSelectedMemoryId: string | null;
    isLoading: boolean;
    error: string | null;
    fetchMemories: () => Promise<void>;
    createMemory: (name: string) => Promise<void>;
    deleteMemory: (id: string) => Promise<void>;
    setCurrentMemory: (id: string) => void;
    setLastSelectedMemory: (memoryId: string) => void;
}

export const useMemoryStore = create<MemoryState>()(
    persist(
        (set, get) => {
            const api = useApi();

            return {
                memories: [],
                currentMemoryId: null,
                lastSelectedMemoryId: null,
                isLoading: false,
                error: null,

                fetchMemories: async () => {
                    try {
                        set({ isLoading: true, error: null });
                        const memories = await api.memory.fetch();
                        set({ memories, isLoading: false });

                        // Set current memory if none is selected
                        const { currentMemoryId } = get();
                        if (!currentMemoryId && memories.length > 0) {
                            set({ currentMemoryId: memories[0]?.id });
                        }
                    } catch (error) {
                        console.error('Erro ao buscar memórias:', error);
                        set({
                            error: error instanceof Error ? error.message : 'Failed to fetch memories',
                            isLoading: false
                        });
                    }
                },

                createMemory: async (name: string) => {
                    try {
                        set({ isLoading: true, error: null });
                        const newMemory = await api.memory.create({ name });

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
                        await api.memory.delete(id);

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

                setLastSelectedMemory: (memoryId: string) => {
                    set({
                        lastSelectedMemoryId: memoryId,
                    });
                },
            };
        },
        {
            name: 'memory-storage',
            partialize: (state) => ({
                lastSelectedMemoryId: state.lastSelectedMemoryId,
            }),
        }
    )
);
