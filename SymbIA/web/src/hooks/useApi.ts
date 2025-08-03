import { useAuthStore } from '../stores/auth.store';
import { createApiUrl } from '../config/api';
import type { FrontendMessage, FrontendChat, MemoryDTO } from '../types/frontend';
import type { LlmSetListResponse } from '../types/llm';

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
    content: string;
    llmSetId: string;
    chatId?: string;
}

interface MessageResponse {
    userMessage: FrontendMessage;
    assistantMessage: FrontendMessage;
}

export const useApi = () => {
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
            const errorText = await response.text();
            throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
        }

        // Handle empty responses (like 204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }

        return response.json();
    };

    // Funções especializadas para cada endpoint

    // === MEMORY ENDPOINTS ===
    const fetchMemories = async (): Promise<MemoryDTO[]> => {
        return await apiCall(createApiUrl('/memories'));
    };

    const createMemory = async (data: CreateMemoryRequest): Promise<MemoryDTO> => {
        return await apiCall(createApiUrl('/memories'), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    };

    const deleteMemory = async (id: string): Promise<void> => {
        return await apiCall(createApiUrl(`/memories/${id}`), {
            method: 'DELETE',
        });
    };

    // === CHAT ENDPOINTS ===
    const fetchChatsByMemory = async (memoryId: string): Promise<FrontendChat[]> => {
        return await apiCall(createApiUrl(`/chats?memoryId=${memoryId}`));
    };

    const createChat = async (data: CreateChatRequest): Promise<FrontendChat> => {
        return await apiCall(createApiUrl('/chats'), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    };

    const deleteChat = async (chatId: string): Promise<void> => {
        return await apiCall(createApiUrl(`/chats/${chatId}`), {
            method: 'DELETE',
        });
    };

    const updateChatTitle = async (chatId: string, data: UpdateChatTitleRequest): Promise<FrontendChat> => {
        return await apiCall(createApiUrl(`/chats/${chatId}/title`), {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    };

    const updateChatOrder = async (chatId: string, data: UpdateChatOrderRequest): Promise<void> => {
        return await apiCall(createApiUrl(`/chats/${chatId}/order`), {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    };

    // === MESSAGE ENDPOINTS ===
    const fetchMessages = async (chatId: string): Promise<FrontendMessage[]> => {
        return await apiCall(createApiUrl(`/chats/${chatId}/messages`));
    };

    const sendMessage = async (memoryId: string, data: SendMessageRequest): Promise<MessageResponse> => {
        return await apiCall(createApiUrl(`/chats/${memoryId}/messages`), {
            method: 'POST',
            body: JSON.stringify(data),
        });
    };

    // === STREAMING ENDPOINTS ===
    const createStreamingRequest = async (memoryId: string, data: SendMessageRequest): Promise<Response> => {
        const token = getAuthToken();

        const response = await fetch(createApiUrl(`/chats/${memoryId}/messages`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    };

    // === LLM SETS ENDPOINTS ===
    const fetchLLMSets = async (): Promise<LlmSetListResponse> => {
        return await apiCall(createApiUrl('/llm-sets'));
    };

    return {
        // Funções especializadas
        memory: {
            fetch: fetchMemories,
            create: createMemory,
            delete: deleteMemory,
        },
        chat: {
            fetchByMemory: fetchChatsByMemory,
            create: createChat,
            delete: deleteChat,
            updateTitle: updateChatTitle,
            updateOrder: updateChatOrder,
        },
        message: {
            fetch: fetchMessages,
            send: sendMessage,
            createStream: createStreamingRequest,
        },
        llm: {
            fetchSets: fetchLLMSets,
        },
        // Função genérica para casos especiais
        apiCall,
    };
};
