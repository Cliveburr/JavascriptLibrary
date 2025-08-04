import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import './LoginPage.scss';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const login = useAuthStore(state => state.login);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await login({ email, password });
        } catch {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, login]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1>SymbIA</h1>
                    <p>Enter your credentials to access your memories</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            disabled={isLoading}
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="register-link">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
