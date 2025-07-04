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

    // Decomposição de mensagens
    messageDecomposer: {
        decompose: (message) => api.post('/api/decompose', { message }),
        getDecomposition: (id) => api.get(`/api/decompose/${id}`),
    },

    // Planejamento de execução
    executionPlanner: {
        createPlan: (message) => api.post('/api/decompose/plan', { message }),
        getPlan: (id) => api.get(`/api/plan/${id}`),
    },

    // Executor de pipeline
    pipelineExecutor: {
        execute: (plan) => api.post('/api/execute', plan),
        getStatus: (id) => api.get(`/api/execute/${id}`),
    },

    // Ciclo de pensamento
    thoughtCycle: {
        process: (data) => api.post('/api/thought-cycle', data),
        getResult: (id) => api.get(`/api/thought-cycle/${id}`),
    },
};

export default api;
