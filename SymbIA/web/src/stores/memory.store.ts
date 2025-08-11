import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MemoryDTO } from '../types/frontend';
import { apiService } from '../utils/apiService';

interface MemoryState {
    memories: MemoryDTO[];
    selectedMemoryId: string;
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
                selectedMemoryId: '',
                isLoading: false,

                fetchMemories: async () => {
                    try {
                        set({ isLoading: true });
                        const memories = await apiService.memory.fetchAll();
                        const { selectedMemoryId } = get();
                        const existSelectedMemory = memories
                            .filter(m => m.id == selectedMemoryId)[0];
                        if (!existSelectedMemory) {
                            if (memories.length > 0) {
                                set({
                                    memories,
                                    selectedMemoryId: memories[0]?.id,
                                    isLoading: false
                                });
                            }
                            else {
                                throw 'Invalid memory state: No Memories!';
                            }
                        }
                        else {
                            set({
                                memories,
                                isLoading: false
                            });
                        }
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                createMemory: async (name: string) => {
                    try {
                        set({ isLoading: true });
                        const newMemory = await apiService.memory.create({ name });

                        const { memories, selectedMemoryId } = get();
                        const updated = [...memories, newMemory];
                        set({
                            memories: updated,
                            selectedMemoryId: selectedMemoryId || newMemory.id,
                            isLoading: false
                        });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                deleteMemory: async (id: string) => {
                    try {
                        const { memories, selectedMemoryId } = get();

                        // Don't allow deletion if it's the last memory
                        if (memories.length <= 1) {
                            throw new Error('Cannot delete the last memory');
                        }

                        set({ isLoading: true });
                        await apiService.memory.delete(id);

                        const updatedMemories = memories.filter(m => m.id !== id);
                        const newselectedMemoryId = selectedMemoryId === id
                            ? (updatedMemories[0].id!)
                            : selectedMemoryId;

                        set({
                            memories: updatedMemories,
                            selectedMemoryId: newselectedMemoryId,
                            isLoading: false
                        });
                    } catch (error) {
                        set({ isLoading: false });
                        throw error;
                    }
                },

                setCurrentMemory: (id: string) => {
                    set({ selectedMemoryId: id });
                },
            };
        },
        {
            name: 'memory-storage',
            partialize: (state) => ({
                selectedMemoryId: state.selectedMemoryId,
            }),
        }
    )
);
