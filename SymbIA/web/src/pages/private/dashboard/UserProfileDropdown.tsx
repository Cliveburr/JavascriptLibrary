import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../../stores';
import './UserProfileDropdown.scss';

export const UserProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuthStore();

    // Fechar dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    if (!user) return null;

    // Gerar iniciais do usuário para o avatar
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const displayName = user.username || user.email.split('@')[0];
    const initials = getInitials(displayName || 'U');

    return (
        <div className="user-profile-dropdown" ref={dropdownRef}>
            <button
                className="user-profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className="user-avatar">
                    {initials}
                </div>
                <div className="user-info">
                    <span className="username">{displayName}</span>
                    <span className="email">{user.email}</span>
                </div>
                <svg
                    className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                >
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setIsOpen(false);
                            // TODO: Implementar configuração do perfil
                            console.log('Configuração do perfil');
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2 1.5c1.5 0 4.5.75 4.5 2.25V14H1.5v-2.25c0-1.5 3-2.25 4.5-2.25h4z"
                                fill="currentColor"
                            />
                        </svg>
                        Configuração do perfil
                    </button>

                    <div className="dropdown-divider" />

                    <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path
                                d="M6 2h4a1 1 0 0 1 1 1v1h-1V3H6v10h4v-1h1v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"
                                fill="currentColor"
                            />
                            <path
                                d="M11.5 8.5l2-2-2-2v1.5H9v1h2.5v1.5z"
                                fill="currentColor"
                            />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};
