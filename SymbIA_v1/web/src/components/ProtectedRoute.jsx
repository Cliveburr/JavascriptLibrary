import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, isInitialized } = useApp();
    
    // Mostrar loading enquanto verifica a autenticação
    if (!isInitialized || isLoading) {
        return (
            <div className="hero is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <div className="is-size-3">
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>
                        <p className="mt-3">Verificando autenticação...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        // Redireciona para login se não estiver autenticado
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
