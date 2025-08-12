import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { useAuthStore } from '../../stores';
import './Header.scss';

export interface HeaderProps {
    title?: string;
    onMenuClick?: () => void;
    showMenu?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title = 'SymbIA',
    onMenuClick,
    showMenu = false,
}) => {
    const { isAuthenticated, user, logout } = useAuthStore();

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__left">
                    {showMenu && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="header__menu-btn"
                            onClick={onMenuClick}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                            </svg>
                        </Button>
                    )}

                    <Link to="/" className="header__logo">
                        <span className="logo-icon">🧠</span>
                        <h1 className="logo-text">
                            <span className="text-gradient">{title}</span>
                        </h1>
                    </Link>
                </div>

                <div className="header__right">
                    {isAuthenticated ? (
                        <>
                            <nav className="header__nav">
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                <Link to="/prompts" className="nav-link">Prompts</Link>
                            </nav>

                            <div className="header__actions">
                                <span className="user-info">
                                    Welcome, {user?.username || user?.email}
                                </span>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="header__actions">
                            <Link to="/login">
                                <Button variant="outline" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
