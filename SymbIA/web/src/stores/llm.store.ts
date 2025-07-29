import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LLMModel {
    id: string;
    name: string;
    provider: string;
    description?: string;
    isActive: boolean;
}

interface LLMState {
    availableModels: LLMModel[];
    selectedModelId: string | null;
    isLoading: boolean;
    error: string | null;
    loadModels: () => Promise<void>;
    setSelectedModel: (modelId: string) => void;
}

// Future API integration helpers
// const getAuthToken = () => {
//     const authStorage = localStorage.getItem('auth-storage');
//     if (authStorage) {
//         const parsed = JSON.parse(authStorage);
//         return parsed.state?.token;
//     }
//     return null;
// };

// const apiCall = async (url: string, options: RequestInit = {}) => {
//     const token = getAuthToken();
//     const response = await fetch(url, {
//         ...options,
//         headers: {
//             'Content-Type': 'application/json',
//             ...(token && { 'Authorization': `Bearer ${token}` }),
//             ...options.headers,
//         },
//     });
//     if (!response.ok) {
//         throw new Error(`API call failed: ${response.statusText}`);
//     }
//     return response.json();
// };

export const useLLMStore = create<LLMState>()(
    persist(
        (set, get) => ({
            availableModels: [],
            selectedModelId: null,
            isLoading: false,
            error: null,

            loadModels: async () => {
                try {
                    set({ isLoading: true, error: null });

                    // Mock data por enquanto - substituir por API real
                    const mockModels: LLMModel[] = [
                        {
                            id: 'gpt-4o',
                            name: 'GPT-4o',
                            provider: 'OpenAI',
                            description: 'Most capable model for complex tasks',
                            isActive: true
                        },
                        {
                            id: 'gpt-4o-mini',
                            name: 'GPT-4o Mini',
                            provider: 'OpenAI',
                            description: 'Faster and more cost-effective',
                            isActive: true
                        },
                        {
                            id: 'llama3.1:8b',
                            name: 'Llama 3.1 8B',
                            provider: 'Ollama',
                            description: 'Local model for privacy',
                            isActive: true
                        },
                        {
                            id: 'claude-3-haiku',
                            name: 'Claude 3 Haiku',
                            provider: 'Anthropic',
                            description: 'Fast and efficient model',
                            isActive: true
                        }
                    ];

                    // Simular delay da API
                    await new Promise(resolve => setTimeout(resolve, 500));

                    set({
                        availableModels: mockModels,
                        isLoading: false
                    });

                    // Selecionar primeiro modelo se nenhum estiver selecionado
                    const { selectedModelId } = get();
                    if (!selectedModelId && mockModels.length > 0) {
                        set({ selectedModelId: mockModels[0]?.id });
                    }

                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Failed to load models',
                        isLoading: false
                    });
                }
            },

            setSelectedModel: (modelId: string) => {
                set({ selectedModelId: modelId });
            }
        }),
        {
            name: 'llm-storage',
            partialize: (state) => ({
                selectedModelId: state.selectedModelId,
            }),
        }
    )
);
