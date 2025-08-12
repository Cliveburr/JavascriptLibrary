import React from 'react';
// using framework utilities

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
        <div className="flex flex-col" style={{ minHeight: '100vh' }}>
            {header && (
                <header>{header}</header>
            )}

            <div className="flex flex-1">
                {sidebar && (
                    <aside className="flex-shrink-0" style={{ width: 280, minWidth: 280 }}>
                        {sidebar}
                    </aside>
                )}

                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>

            {footer && (
                <footer>{footer}</footer>
            )}
        </div>
    );
};
