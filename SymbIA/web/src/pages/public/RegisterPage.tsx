import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { useNotificationStore } from '../../stores/notification.store';

interface ApiError {
    message?: string;
}

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const addNotification = useNotificationStore(state => state.addNotification);

    const register = useAuthStore(state => state.register);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Using notifications instead of inline error state

        if (password !== confirmPassword) {
            addNotification({ type: 'error', title: 'Check your password', message: 'Passwords do not match', timeout: 8 });
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            addNotification({ type: 'error', title: 'Weak password', message: 'Password must be at least 6 characters long', timeout: 8 });
            setIsLoading(false);
            return;
        }

        try {
            await register({ username, email, password });
        } catch (err: unknown) {
            const apiError = err as ApiError;
            addNotification({ type: 'error', title: 'Registration failed', message: apiError.message || 'Try again later', timeout: 10 });
        } finally {
            setIsLoading(false);
        }
    }, [username, email, password, confirmPassword, register]);

    const handleUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }, []);

    const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-register-gradient px-sm">
            <div className="bg-surface border rounded-lg w-100" style={{ maxWidth: 400, padding: '2.5rem', boxShadow: '0 10px 30px rgba(0,0,0,.3)', borderColor: 'var(--border-subtle)', backdropFilter: 'blur(10px)' }}>
                <div className="text-center mb-lg">
                    <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' as any }}>
                        Join SymbIA
                    </h1>
                    <p className="text-secondary text-sm">Create your account and start building memories</p>
                </div>

                <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            disabled={isLoading}
                            placeholder="Your username"
                            minLength={3}
                            className="form-input"
                        />
                    </div>

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
                            data-testid="email-input"
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
                            placeholder="At least 6 characters"
                            data-testid="password-input"
                            minLength={6}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            disabled={isLoading}
                            placeholder="Confirm your password"
                            data-testid="confirm-password-input"
                            minLength={6}
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-sm"
                        disabled={isLoading}
                        data-testid="register-button"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-lg pt-md" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <p className="text-secondary text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
