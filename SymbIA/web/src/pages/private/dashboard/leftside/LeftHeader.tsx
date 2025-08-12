import React from 'react';
import { UserProfileDropdown } from './UserProfileDropdown';

export const LeftHeader: React.FC = () => {
    return (
        <>
            {/* Logo Section */}
            <div className="py-xs border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                <a href="/" className="flex items-center justify-center rounded-md" style={{ textDecoration: 'none' }}>
                    <img src="/logo.png" alt="SymbIA" style={{ height: '7.5rem' }} />
                </a>
            </div>

            {/* User Profile Section */}
            <div className="py-xs border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                <UserProfileDropdown />
            </div>
        </>
    );
};
