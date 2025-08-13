import React from 'react';

export interface TabItem {
    id: string;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    badge?: string | number;
}

export interface TabsProps {
    items: TabItem[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline' | 'bordered';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
    items,
    activeTab,
    onTabChange,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    className = ''
}) => {
    const baseClass = 'tabs';
    const variantClass = `tabs--${variant}`;
    const sizeClass = `tabs--${size}`;
    const fullWidthClass = fullWidth ? 'tabs--full-width' : '';

    const tabsClasses = [baseClass, variantClass, sizeClass, fullWidthClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={tabsClasses}>
            <div className="tabs__list" role="tablist">
                {items.map((item) => {
                    const isActive = activeTab === item.id;
                    const isDisabled = item.disabled;

                    const tabClasses = [
                        'tabs__tab',
                        isActive ? 'tabs__tab--active' : '',
                        isDisabled ? 'tabs__tab--disabled' : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-disabled={isDisabled}
                            disabled={isDisabled}
                            className={tabClasses}
                            onClick={() => !isDisabled && onTabChange(item.id)}
                        >
                            {item.icon && (
                                <span className="tabs__icon">
                                    {item.icon}
                                </span>
                            )}

                            <span className="tabs__label">
                                {item.label}
                            </span>

                            {item.badge && (
                                <span className="tabs__badge">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Tabs;
