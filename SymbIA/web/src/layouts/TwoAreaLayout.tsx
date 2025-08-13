import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuthStore } from '../stores';
import { Tabs, type TabItem as TabsTabItem } from '../components/ui';

export interface TabItem {
    id: string;
    label: string;
    content: React.ReactNode;
}

export interface TwoAreaLayoutProps {
    children: React.ReactNode;
    dynamicTabs?: TabItem[];
    activeTabId?: string;
    onTabChange?: (tabId: string) => void;
}

const STORAGE_KEY = 'twoAreaLayout_leftWidth';
const DEFAULT_LEFT_WIDTH = 350;
const MIN_LEFT_WIDTH = 250;
const MAX_LEFT_WIDTH = 600;

export const TwoAreaLayout: React.FC<TwoAreaLayoutProps> = ({
    children,
    dynamicTabs = [],
    activeTabId,
    onTabChange,
}) => {
    const { user, logout } = useAuthStore();
    const [leftWidth, setLeftWidth] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? parseInt(saved, 10) : DEFAULT_LEFT_WIDTH;
    });
    const [isResizing, setIsResizing] = useState(false);
    const [activeTab, setActiveTab] = useState(activeTabId || 'menu');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Create tab items for the Tabs component
    const tabItems: TabsTabItem[] = [
        {
            id: 'menu',
            label: '',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )
        },
        ...dynamicTabs.map(tab => ({
            id: tab.id,
            label: tab.label
        }))
    ];

    // Save width to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, leftWidth.toString());
    }, [leftWidth]);

    // Handle tab changes
    useEffect(() => {
        if (activeTabId && activeTabId !== activeTab) {
            setActiveTab(activeTabId);
        }
    }, [activeTabId, activeTab]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = e.clientX - containerRect.left;

        if (newWidth >= MIN_LEFT_WIDTH && newWidth <= MAX_LEFT_WIDTH) {
            setLeftWidth(newWidth);
        }
    }, [isResizing]);

    const handleMouseUp = useCallback(() => {
        setIsResizing(false);
    }, []);

    useEffect(() => {
        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const handleTabClick = useCallback((tabId: string) => {
        setActiveTab(tabId);
        if (onTabChange) {
            onTabChange(tabId);
        }
    }, [onTabChange]);

    const handleLogout = useCallback(() => {
        logout();
        setIsUserDropdownOpen(false);
    }, [logout]);

    // Generate user initials
    const getUserInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    const displayName = user?.username || user?.email?.split('@')[0] || 'User';
    const initials = getUserInitials(displayName);

    return (
        <div ref={containerRef} className="flex h-screen bg-surface overflow-hidden">
            {/* Left Area */}
            <div
                className="flex flex-col bg-surface-variant border-r border-outline"
                style={{ width: leftWidth, minWidth: leftWidth, maxWidth: leftWidth }}
            >
                {/* Logo */}
                <div className="pt-sm px-sm">
                    <a href="/" className="inline-block">
                        <img
                            src="/logo.png"
                            alt="SymbIA Logo"
                        />
                    </a>
                </div>

                {/* User Profile Dropdown */}
                <div className="p-sm border-b border-outline" ref={dropdownRef}>
                    <div className="dropdown w-100">
                        <button
                            className="btn btn-outline w-100 inline-flex items-center gap-sm justify-start"
                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                            aria-expanded={isUserDropdownOpen}
                        >
                            <div
                                className="rounded-full bg-accent text-on-accent flex items-center justify-center flex-shrink-0"
                                style={{ width: '2rem', height: '2rem', fontSize: '0.75rem', fontWeight: 600 }}
                            >
                                {initials}
                            </div>
                            <span className="text-left flex-1 min-w-0 truncate">
                                {displayName}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-150 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="dropdown-menu mt-xs">
                                <button className="dropdown-item inline-flex items-center gap-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Configuração do perfil
                                </button>
                                <div className="dropdown-divider"></div>
                                <button
                                    className="dropdown-item inline-flex items-center gap-sm text-error"
                                    onClick={handleLogout}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-1 flex flex-col min-h-0">
                    <Tabs
                        items={tabItems}
                        activeTab={activeTab}
                        onTabChange={handleTabClick}
                        variant="underline"
                        size="sm"
                    />

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === 'menu' && (
                            <div className="p-lg">
                                <nav className="flex flex-col gap-sm">
                                    <a
                                        href="/dashboard"
                                        className="btn btn-ghost justify-start inline-flex items-center gap-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                                        </svg>
                                        Dashboard
                                    </a>
                                    <a
                                        href="/style"
                                        className="btn btn-ghost justify-start inline-flex items-center gap-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                                        </svg>
                                        Style
                                    </a>
                                    <a
                                        href="/prompts"
                                        className="btn btn-ghost justify-start inline-flex items-center gap-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Prompts
                                    </a>
                                </nav>
                            </div>
                        )}

                        {/* Dynamic Tab Content */}
                        {dynamicTabs.map((tab) => (
                            activeTab === tab.id && (
                                <div key={tab.id} className="h-full">
                                    {tab.content}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>

            {/* Resizer */}
            <div
                className="w-2 cursor-col-resize transition-all duration-200 ease-in-out relative group"
                onMouseDown={handleMouseDown}
                title="Arraste para redimensionar as áreas"
                style={{
                    background: `linear-gradient(to right, 
                        var(--bg-surface-variant) 0%, 
                        var(--bg-surface-content) 100%
                    )`,
                    cursor: 'col-resize'
                }}
            >
                {/* Visual indicator dots */}
                <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-1">
                        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing
                            ? 'bg-primary scale-125 shadow-sm'
                            : 'bg-outline opacity-80 group-hover:bg-primary group-hover:opacity-100 group-hover:scale-110'
                            }`}></div>
                        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing
                            ? 'bg-primary scale-125 shadow-sm'
                            : 'bg-outline opacity-80 group-hover:bg-primary group-hover:opacity-100 group-hover:scale-110'
                            }`}></div>
                        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing
                            ? 'bg-primary scale-125 shadow-sm'
                            : 'bg-outline opacity-80 group-hover:bg-primary group-hover:opacity-100 group-hover:scale-110'
                            }`}></div>
                        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing
                            ? 'bg-primary scale-125 shadow-sm'
                            : 'bg-outline opacity-80 group-hover:bg-primary group-hover:opacity-100 group-hover:scale-110'
                            }`}></div>
                        <div className={`w-1 h-1 rounded-full transition-all duration-200 ${isResizing
                            ? 'bg-primary scale-125 shadow-sm'
                            : 'bg-outline opacity-80 group-hover:bg-primary group-hover:opacity-100 group-hover:scale-110'
                            }`}></div>
                    </div>
                </div>

                {/* Hover area extension for better UX */}
                <div
                    className="absolute inset-y-0 -left-3 -right-3"
                    style={{ cursor: 'col-resize' }}
                />
            </div>

            {/* Right Area */}
            <div className="flex-1 min-w-0 bg-surface-content overflow-y-auto">
                {children}
            </div>
        </div>
    );
};
