import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Criar instância do axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptador de requisição
api.interceptors.request.use(
    (config) => {
        // Adicionar token de autenticação se existir
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador de resposta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Tratar erros globalmente - mas não redirecionar automaticamente
        // para evitar loops durante a verificação inicial
        if (error.response?.status === 401 && !error.config.url.includes('/me')) {
            localStorage.removeItem('authToken');
            // Não redirecionar automaticamente aqui para evitar loops
        }
        return Promise.reject(error);
    }
);

// Funções de API
export const apiService = {
    // Autenticação
    auth: {
        login: (credentials) => api.post('/api/auth/login', credentials),
        register: (userData) => api.post('/api/auth/register', userData),
        logout: () => api.post('/api/auth/logout'),
        me: () => api.get('/api/auth/me'), // Endpoint para obter dados do usuário autenticado
    },

    // Memórias
    memories: {
        getAll: () => api.get('/api/memories'),
        create: (name) => api.post('/api/memories', { name }),
        delete: (id) => api.delete(`/api/memories/${id}`),
        getById: (id) => api.get(`/api/memories/${id}`),
    },

    // Chats
    chats: {
        getAll: () => api.get('/api/chats'),
        getById: (id) => api.get(`/api/chats/${id}`),
        create: (title, message) => api.post('/api/chats', { title, message }),
        addMessage: (chatId, message, role = 'user') => api.post(`/api/chats/${chatId}/messages`, { message, role }),
        delete: (id) => api.delete(`/api/chats/${id}`),
        generateTitle: (message, assistantResponse) => api.post('/api/chats/generate-title', { message, assistantResponse }),
        streamChat: async function(chatId, message, isNewChat = false, onChunk, onError, onComplete) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/chats/stream`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    },
                    body: JSON.stringify({
                        chatId,
                        message,
                        isNewChat
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    throw new Error('No reader available');
                }

                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                
                                if (data.error) {
                                    onError?.(data.error);
                                    return;
                                }
                                
                                if (data.content) {
                                    onChunk?.(data.content, data.type);
                                }
                                
                                if (data.done) {
                                    onComplete?.(data);
                                    return;
                                }
                                
                                if (data.needsTitle) {
                                    // Sinaliza que precisa gerar título
                                    onComplete?.({ needsTitle: true, chatId: data.chatId });
                                    return;
                                }
                            } catch (e) {
                                console.error('Error parsing SSE data:', e);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Stream error:', error);
                onError?.(error.message || 'Connection error');
            }
        }
    },
};

export default api;
