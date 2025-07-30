import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores';
import './RegisterPage.scss';

interface ApiError {
    message?: string;
}

export const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const register = useAuthStore(state => state.register);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        try {
            await register({ username, email, password });
        } catch (err: unknown) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1>Join SymbIA</h1>
                    <p>Create your account and start building memories</p>
                </div>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="Your username"
                            minLength={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="your@email.com"
                            data-testid="email-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="At least 6 characters"
                            data-testid="password-input"
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={isLoading}
                            placeholder="Confirm your password"
                            data-testid="confirm-password-input"
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="error-message" data-testid="error-message">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={isLoading}
                        data-testid="register-button"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="login-link">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
