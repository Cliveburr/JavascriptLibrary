import React from 'react';
import './MainLayout.scss';

export interface MainLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    footer?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    header,
    sidebar,
    footer,
}) => {
    return (
        <div className="main-layout">
            {header && (
                <header className="main-layout__header">
                    {header}
                </header>
            )}

            <div className="main-layout__body">
                {sidebar && (
                    <aside className="main-layout__sidebar">
                        {sidebar}
                    </aside>
                )}

                <main className="main-layout__content">
                    {children}
                </main>
            </div>

            {footer && (
                <footer className="main-layout__footer">
                    {footer}
                </footer>
            )}
        </div>
    );
};
