import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from '../pages/public/Login';
import Register from '../pages/public/Register';
import Dashboard from '../pages/private/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: (
            <section className="hero is-warning is-fullheight">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="title">404 - Página não encontrada</h1>
                        <p className="subtitle">A página que você está procurando não existe.</p>
                        <a href="/" className="button is-primary">
                            Voltar para Home
                        </a>
                    </div>
                </div>
            </section>
        ),
    },
]);

const AppRouter = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
