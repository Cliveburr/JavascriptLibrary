import React from 'react';

export const AuthLoadingScreen: React.FC = () => {
    return (
        <div className="auth-loading-screen">
            <div className="auth-loading-container">
                <div className="auth-loading-logo">
                    <h1>SymbIA</h1>
                </div>
                <div className="auth-loading-spinner">
                    <div className="spinner"></div>
                </div>
                <p className="auth-loading-text">Validating authentication...</p>
            </div>
        </div>
    );
};
