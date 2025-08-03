import React from 'react';
import { UserProfileDropdown } from '../UserProfileDropdown';

export const LeftHeader: React.FC = () => {
    return (
        <>
            {/* Logo Section */}
            <div className="logo-section">
                <a href="/" className="logo-link">
                    <img
                        src="/logo.png"
                        alt="SymbIA"
                        className="logo-image"
                    />
                </a>
            </div>

            {/* User Profile Section */}
            <div className="user-section">
                <UserProfileDropdown />
            </div>
        </>
    );
};
