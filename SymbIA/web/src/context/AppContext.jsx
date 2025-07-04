import React, { createContext, useContext, useReducer } from 'react';

// Ações do reducer
const actionTypes = {
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOGOUT: 'LOGOUT'
};

// Estado inicial
const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false
};

// Reducer
const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: !!action.payload,
                error: null
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
                isLoading: false
            };
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        case actionTypes.LOGOUT:
            return {
                ...initialState
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
