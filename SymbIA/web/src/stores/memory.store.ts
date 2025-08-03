import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemoryDTO } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface MemoryState {
    memories: MemoryDTO[];
    currentMemoryId: string | null;
    isLoading: boolean;
    fetchMemories: () => Promise<void>;
    createMemory: (name: string) => Promise<void>;
    deleteMemory: (id: string) => Promise<void>;
    setCurrentMemory: (id: string) => void;
}

export const useMemoryStore = create<MemoryState>()(
    persist(
        (set, get) => {
            return {
                memories: [],
                currentMemoryId: null,
                isLoading: false,

                fetchMemories: async () => {
                    try {
                        set({ isLoading: true });
                        const memories = await apiService.memory.fetchAll();
                        set({ memories });

                        // Set current memory if none is selected
                        const { currentMemoryId } = get();
                        if (!currentMemoryId && memories.length > 0) {
                            set({ currentMemoryId: memories[0]?.id });
                        }
                    } catch (error) {
                        console.error(error);
                        set({ isLoading: false });
                        throw error;
                    }
                },

                createMemory: async (name: string) => {
                    try {
                        set({ isLoading: true });
                        const newMemory = await apiService.memory.create({ name });

                        const { memories } = get();
                        set({
                            memories: [...memories, newMemory],
                            isLoading: false
                        });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                deleteMemory: async (id: string) => {
                    try {
                        const { memories, currentMemoryId } = get();

                        // Don't allow deletion if it's the last memory
                        if (memories.length <= 1) {
                            throw new Error('Cannot delete the last memory');
                        }

                        set({ isLoading: true });
                        await apiService.memory.delete(id);

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
                        set({ isLoading: false });
                        throw error;
                    }
                },

                setCurrentMemory: (id: string) => {
                    set({ currentMemoryId: id });
                },
            };
        },
        {
            name: 'memory-storage',
            partialize: (state) => ({
                currentMemoryId: state.currentMemoryId,
            }),
        }
    )
);
