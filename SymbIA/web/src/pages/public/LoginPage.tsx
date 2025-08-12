import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useNotificationStore } from '../../stores/notification.store';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // notifications
    const addNotification = useNotificationStore(state => state.addNotification);

    const login = useAuthStore(state => state.login);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // clear any page-level errors (we use notifications now)

        try {
            await login({ email, password });
        } catch {
            addNotification({
                type: 'error',
                title: 'Login failed',
                message: 'Invalid email or password',
                timeout: 8,
            });
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
        <div className="min-h-screen flex items-center justify-center bg-auth-gradient px-sm">
            <div className="bg-glass border rounded-lg w-100" style={{ maxWidth: 400, padding: '2.5rem 2rem', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,.1)', boxShadow: '0 20px 40px rgba(0,0,0,.3)' }}>
                <div className="text-center mb-lg">
                    <h1 className="text-3xl font-light mb-xs tracking-wide">SymbIA</h1>
                    <p className="text-secondary text-sm">Enter your credentials to access your memories</p>
                </div>

                <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            disabled={isLoading}
                            placeholder="your@email.com"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                            placeholder="••••••••"
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-lg pt-md" style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
                    <p className="text-secondary text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-accent font-medium">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
