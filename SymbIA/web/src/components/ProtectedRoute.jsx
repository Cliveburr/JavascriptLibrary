import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Componente para proteger rotas que precisam de autenticação
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useApp();
    
    if (!isAuthenticated) {
        // Redireciona para login se não estiver autenticado
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
