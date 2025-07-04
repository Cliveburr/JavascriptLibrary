import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Ações do reducer
const actionTypes = {
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOGOUT: 'LOGOUT',
    INIT_AUTH: 'INIT_AUTH',
    SET_MEMORIES: 'SET_MEMORIES',
    ADD_MEMORY: 'ADD_MEMORY',
    REMOVE_MEMORY: 'REMOVE_MEMORY',
    SET_SELECTED_MEMORY: 'SET_SELECTED_MEMORY',
    SET_CHATS: 'SET_CHATS',
    ADD_CHAT: 'ADD_CHAT',
    UPDATE_CHAT: 'UPDATE_CHAT',
    REMOVE_CHAT: 'REMOVE_CHAT',
    SET_SELECTED_CHAT: 'SET_SELECTED_CHAT'
};

// Estado inicial
const initialState = {
    user: null,
    isLoading: true, // Inicialmente true para verificar autenticação
    error: null,
    isAuthenticated: false,
    isInitialized: false, // Flag para indicar se a verificação inicial foi feita
    memories: [],
    selectedMemory: null,
    chats: [],
    selectedChat: null
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                error: null,
                isLoading: false,
                isInitialized: true
            };
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case actionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload,
                isLoading: false,
                isInitialized: true
            };
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        case actionTypes.LOGOUT:
            return {
                ...initialState,
                isLoading: false,
                isInitialized: true
            };
        case actionTypes.INIT_AUTH:
            return {
                ...state,
                isLoading: false,
                isInitialized: true
            };
        case actionTypes.SET_MEMORIES:
            const selectedMemory = action.payload.length > 0 
                ? (state.selectedMemory ? state.selectedMemory : action.payload[0])
                : null;
            return {
                ...state,
                memories: action.payload,
                selectedMemory
            };
        case actionTypes.ADD_MEMORY:
            return {
                ...state,
                memories: [...state.memories, action.payload]
            };
        case actionTypes.REMOVE_MEMORY:
            const updatedMemories = state.memories.filter(memory => memory._id !== action.payload);
            let newSelectedMemory = state.selectedMemory;
            if (state.selectedMemory && state.selectedMemory._id === action.payload) {
                newSelectedMemory = updatedMemories.length > 0 ? updatedMemories[0] : null;
            }
            return {
                ...state,
                memories: updatedMemories,
                selectedMemory: newSelectedMemory
            };
        case actionTypes.SET_SELECTED_MEMORY:
            // Salvar no localStorage
            if (action.payload) {
                localStorage.setItem('selectedMemoryId', action.payload._id);
            } else {
                localStorage.removeItem('selectedMemoryId');
            }
            return {
                ...state,
                selectedMemory: action.payload
            };
        case actionTypes.SET_CHATS:
            const validChats = Array.isArray(action.payload) 
                ? action.payload.filter(chat => chat && chat._id) 
                : [];
            return {
                ...state,
                chats: validChats
            };
        case actionTypes.ADD_CHAT:
            // Verificar se o chat é válido antes de adicionar
            if (!action.payload || !action.payload._id) {
                console.warn('Tentativa de adicionar chat inválido:', action.payload);
                return state;
            }
            return {
                ...state,
                chats: [action.payload, ...state.chats]
            };
        case actionTypes.UPDATE_CHAT:
            return {
                ...state,
                chats: state.chats.map(chat => 
                    chat._id === action.payload._id ? action.payload : chat
                )
            };
        case actionTypes.REMOVE_CHAT:
            const updatedChats = state.chats.filter(chat => chat._id !== action.payload);
            let newSelectedChat = state.selectedChat;
            if (state.selectedChat && state.selectedChat._id === action.payload) {
                newSelectedChat = null;
            }
            return {
                ...state,
                chats: updatedChats,
                selectedChat: newSelectedChat
            };
        case actionTypes.SET_SELECTED_CHAT:
            return {
                ...state,
                selectedChat: action.payload
            };
        default:
            return state;
    }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Verificar autenticação ao inicializar
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('authToken');
            
            if (token) {
                try {
                    // Verificar se o token ainda é válido fazendo uma requisição para o endpoint /me
                    const response = await apiService.auth.me();
                    
                    if (response.data && response.data.data) {
                        const user = {
                            ...response.data.data,
                            token: token
                        };
                        dispatch({ type: actionTypes.SET_USER, payload: user });
                    } else {
                        // Token inválido, remover do localStorage
                        localStorage.removeItem('authToken');
                        dispatch({ type: actionTypes.INIT_AUTH });
                    }
                } catch (error) {
                    // Se o endpoint /me não existir (404) ou o token for inválido/expirado
                    // Podemos tentar uma abordagem alternativa: decodificar o JWT localmente
                    // para pelo menos extrair informações básicas, mas isso é menos seguro
                    try {
                        // Verificar se o token está bem formatado
                        const tokenParts = token.split('.');
                        if (tokenParts.length === 3) {
                            const payload = JSON.parse(atob(tokenParts[1]));
                            const currentTime = Date.now() / 1000;
                            
                            // Verificar se o token não expirou
                            if (payload.exp && payload.exp > currentTime) {
                                // Token ainda válido localmente, criar usuário com dados básicos
                                const user = {
                                    id: payload.id,
                                    username: payload.username,
                                    name: payload.username,
                                    token: token
                                };
                                dispatch({ type: actionTypes.SET_USER, payload: user });
                            } else {
                                // Token expirado
                                localStorage.removeItem('authToken');
                                dispatch({ type: actionTypes.INIT_AUTH });
                            }
                        } else {
                            // Token mal formatado
                            localStorage.removeItem('authToken');
                            dispatch({ type: actionTypes.INIT_AUTH });
                        }
                    } catch (decodeError) {
                        // Erro ao decodificar token, remover
                        localStorage.removeItem('authToken');
                        dispatch({ type: actionTypes.INIT_AUTH });
                    }
                }
            } else {
                // Não há token, usuário não está autenticado
                dispatch({ type: actionTypes.INIT_AUTH });
            }
        };

        initAuth();
    }, []);

    // Actions
    const setUser = (user) => {
        dispatch({ type: actionTypes.SET_USER, payload: user });
    };

    const setLoading = (isLoading) => {
        dispatch({ type: actionTypes.SET_LOADING, payload: isLoading });
    };

    const setError = (error) => {
        dispatch({ type: actionTypes.SET_ERROR, payload: error });
    };

    const clearError = () => {
        dispatch({ type: actionTypes.CLEAR_ERROR });
    };

    const logout = () => {
        // Remover token e memória selecionada do localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('selectedMemoryId');
        dispatch({ type: actionTypes.LOGOUT });
    };

    // Memory actions
    const loadMemories = async () => {
        try {
            const response = await apiService.memories.getAll();
            const memories = response.data;
            dispatch({ type: actionTypes.SET_MEMORIES, payload: memories });
            
            // Restaurar memória selecionada do localStorage
            const savedMemoryId = localStorage.getItem('selectedMemoryId');
            if (savedMemoryId && memories.length > 0) {
                const savedMemory = memories.find(m => m._id === savedMemoryId);
                if (savedMemory) {
                    dispatch({ type: actionTypes.SET_SELECTED_MEMORY, payload: savedMemory });
                }
            }
        } catch (error) {
            console.error('Error loading memories:', error);
            setError('Erro ao carregar memórias');
        }
    };

    const createMemory = async (name) => {
        try {
            const response = await apiService.memories.create(name);
            const newMemory = response.data;
            dispatch({ type: actionTypes.ADD_MEMORY, payload: newMemory });
            return newMemory;
        } catch (error) {
            console.error('Error creating memory:', error);
            setError('Erro ao criar memória');
            throw error;
        }
    };

    const deleteMemory = async (memoryId) => {
        try {
            await apiService.memories.delete(memoryId);
            dispatch({ type: actionTypes.REMOVE_MEMORY, payload: memoryId });
        } catch (error) {
            console.error('Error deleting memory:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Erro ao excluir memória');
            }
            throw error;
        }
    };

    const selectMemory = (memory) => {
        dispatch({ type: actionTypes.SET_SELECTED_MEMORY, payload: memory });
    };

    // Chat actions
    const loadChats = async () => {
        console.log('Loading chats...');
        console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3002');
        console.log('Auth token:', localStorage.getItem('authToken') ? 'exists' : 'missing');
        
        try {
            const response = await apiService.chats.getAll();
            console.log('Chats response:', response);
            console.log('Response data:', response.data);
            console.log('Response status:', response.status);
            console.log('Response data type:', typeof response.data);
            
            // Verificar se a resposta tem a estrutura esperada
            let chats = [];
            if (response.data && response.data.data) {
                chats = Array.isArray(response.data.data) ? response.data.data : [];
                console.log('Using response.data.data:', chats);
            } else if (Array.isArray(response.data)) {
                chats = response.data;
                console.log('Using response.data diretamente:', chats);
            }
            
            // Filtrar apenas chats válidos
            const validChats = chats.filter(chat => {
                const isValid = chat && chat._id && typeof chat._id === 'string';
                if (!isValid) {
                    console.warn('Chat inválido encontrado:', chat);
                }
                return isValid;
            });
            
            console.log('Valid chats to dispatch:', validChats);
            dispatch({ type: actionTypes.SET_CHATS, payload: validChats });
        } catch (error) {
            console.error('Error loading chats:', error);
            console.error('Error details:', error.response);
            setError('Erro ao carregar chats');
            // Em caso de erro, garantir que chats seja um array vazio
            dispatch({ type: actionTypes.SET_CHATS, payload: [] });
        }
    };

    const createChat = async (title, message) => {
        try {
            const response = await apiService.chats.create(title, message);
            const newChat = response.data;
            dispatch({ type: actionTypes.ADD_CHAT, payload: newChat });
            return newChat;
        } catch (error) {
            console.error('Error creating chat:', error);
            setError('Erro ao criar chat');
            throw error;
        }
    };

    const updateChat = (chat) => {
        dispatch({ type: actionTypes.UPDATE_CHAT, payload: chat });
    };

    const addChat = (chat) => {
        dispatch({ type: actionTypes.ADD_CHAT, payload: chat });
    };

    const deleteChat = async (chatId) => {
        try {
            await apiService.chats.delete(chatId);
            dispatch({ type: actionTypes.REMOVE_CHAT, payload: chatId });
        } catch (error) {
            console.error('Error deleting chat:', error);
            setError('Erro ao excluir chat');
            throw error;
        }
    };

    const removeChat = (chatId) => {
        // Remove chat localmente sem chamada de API (para chats temporários)
        dispatch({ type: actionTypes.REMOVE_CHAT, payload: chatId });
    };

    const selectChat = (chat) => {
        console.log('Context: Selecting chat:', chat);
        dispatch({ type: actionTypes.SET_SELECTED_CHAT, payload: chat });
    };

    const value = {
        ...state,
        setUser,
        setLoading,
        setError,
        clearError,
        logout,
        loadMemories,
        createMemory,
        deleteMemory,
        selectMemory,
        loadChats,
        createChat,
        addChat,
        updateChat,
        deleteChat,
        removeChat,
        selectChat
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Hook para usar o contexto
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};

export default AppContext;
