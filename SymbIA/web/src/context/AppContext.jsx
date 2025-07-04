import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

// Ações do reducer
const actionTypes = {
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOGOUT: 'LOGOUT',
    INIT_AUTH: 'INIT_AUTH'
};

// Estado inicial
const initialState = {
    user: null,
    isLoading: true, // Inicialmente true para verificar autenticação
    error: null,
    isAuthenticated: false,
    isInitialized: false // Flag para indicar se a verificação inicial foi feita
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
        // Remover token do localStorage
        localStorage.removeItem('authToken');
        dispatch({ type: actionTypes.LOGOUT });
    };

    const value = {
        ...state,
        setUser,
        setLoading,
        setError,
        clearError,
        logout
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
