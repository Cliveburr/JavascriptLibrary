import React from 'react';
import { Button } from './ui';
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

                    <div className="header__logo">
                        <span className="logo-icon">🧠</span>
                        <h1 className="logo-text">
                            <span className="text-gradient">{title}</span>
                        </h1>
                    </div>
                </div>

                <div className="header__right">
                    <nav className="header__nav">
                        <a href="#" className="nav-link">Dashboard</a>
                        <a href="#" className="nav-link">Chat</a>
                        <a href="#" className="nav-link">Memories</a>
                    </nav>

                    <div className="header__actions">
                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                        <Button variant="primary" size="sm">
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};
