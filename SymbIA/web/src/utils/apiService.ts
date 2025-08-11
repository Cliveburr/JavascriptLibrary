import { useAuthStore } from '../stores/auth.store';
import { createApiUrl } from '../config/api';
import type { FrontendChat, MemoryDTO } from '../types/frontend';
import type { LlmSetListResponse } from '../types/llm';
import { ChatIterationDTO } from '../types';

// Tipos para as requisições da API
interface CreateMemoryRequest {
    name: string;
}

interface CreateChatRequest {
    memoryId: string;
    title?: string;
}

interface UpdateChatTitleRequest {
    title: string;
}

interface UpdateChatOrderRequest {
    orderIndex: number;
}

interface SendMessageRequest {
    chatId?: string;
    llmSetId: string;
    content: string;
}

// Versão não-hook da API para usar nos stores
export const apiService = {
    // Função genérica para chamadas da API
    call: async (url: string, options: RequestInit = {}) => {
        const token = useAuthStore.getState().token;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
        }

        // Handle empty responses (like 204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    },

    streamCall: async (url: string, options: RequestInit = {}) => {
        const token = useAuthStore.getState().token;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        });
        return response;
    },

    // === MEMORY ENDPOINTS ===
    memory: {
        fetchAll: async (): Promise<MemoryDTO[]> => {
            return await apiService.call(createApiUrl('/memories'));
        },

        create: async (data: CreateMemoryRequest): Promise<MemoryDTO> => {
            return await apiService.call(createApiUrl('/memories'), {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        delete: async (id: string): Promise<void> => {
            return await apiService.call(createApiUrl(`/memories/${id}`), {
                method: 'DELETE',
            });
        },
    },

    // === CHAT ENDPOINTS ===
    chat: {
        fetchByMemory: async (memoryId: string): Promise<FrontendChat[]> => {
            return await apiService.call(createApiUrl(`/chats?memoryId=${memoryId}`));
        },

        create: async (data: CreateChatRequest): Promise<FrontendChat> => {
            return await apiService.call(createApiUrl('/chats'), {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        delete: async (chatId: string): Promise<void> => {
            return await apiService.call(createApiUrl(`/chats/${chatId}`), {
                method: 'DELETE',
            });
        },

        updateTitle: async (chatId: string, data: UpdateChatTitleRequest): Promise<FrontendChat> => {
            return await apiService.call(createApiUrl(`/chats/${chatId}/title`), {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },

        updateOrder: async (chatId: string, data: UpdateChatOrderRequest): Promise<void> => {
            return await apiService.call(createApiUrl(`/chats/${chatId}/order`), {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
    },

    // === MESSAGE ENDPOINTS ===
    message: {
        fetch: async (chatId: string): Promise<ChatIterationDTO[]> => {
            return await apiService.call(createApiUrl(`/chats/${chatId}/messages`));
        },

        send: async (memoryId: string, data: SendMessageRequest): Promise<Response> => {
            return await apiService.streamCall(createApiUrl(`/chats/${memoryId}/messages`), {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    // === LLM ENDPOINTS ===
    llm: {
        fetchSets: async (): Promise<LlmSetListResponse> => {
            return await apiService.call(createApiUrl('/llm-sets'));
        },
    },
};
