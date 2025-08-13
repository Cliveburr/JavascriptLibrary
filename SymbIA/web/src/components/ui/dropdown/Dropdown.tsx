import React, { useState, useRef, useEffect, ReactNode, ReactElement } from 'react';

// Types
export interface DropdownMenuItem {
    id: string;
    label: string;
    icon?: ReactNode;
    disabled?: boolean;
    selected?: boolean;
    onClick?: () => void;
}

export interface DropdownDivider {
    type: 'divider';
    id: string;
}

export type DropdownItem = DropdownMenuItem | DropdownDivider;

// Type guard functions
const isDivider = (item: DropdownItem): item is DropdownDivider => {
    return 'type' in item && item.type === 'divider';
};

const isMenuItem = (item: DropdownItem): item is DropdownMenuItem => {
    return !isDivider(item);
};

export interface DropdownTemplateData {
    [key: string]: any;
}

export interface DropdownProps {
    // Trigger content
    trigger?: ReactNode;
    placeholder?: string;

    // Dropdown behavior
    isOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    disabled?: boolean;
    closeOnSelect?: boolean;

    // Position
    position?: 'bottom' | 'top' | 'auto';
    align?: 'left' | 'right' | 'center';

    // Style variants
    variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    bordered?: boolean;
    fullWidth?: boolean;

    // Menu mode (default)
    items?: DropdownItem[];

    // Template mode
    template?: (data: any) => ReactElement;
    templateData?: any;

    // Custom content mode
    children?: ReactNode;

    // Callbacks
    onSelect?: (item: DropdownMenuItem) => void;

    // Additional props
    className?: string;
    triggerClassName?: string;
    contentClassName?: string;

    // Icon for trigger
    icon?: ReactNode;
    showCaret?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
    trigger,
    placeholder = 'Select option',
    isOpen: controlledIsOpen,
    onToggle,
    disabled = false,
    closeOnSelect = true,
    position = 'bottom',
    align = 'left',
    variant = 'default',
    size = 'md',
    borderRadius = 'md',
    bordered = false,
    fullWidth = false,
    items = [],
    template,
    templateData,
    children,
    onSelect,
    className = '',
    triggerClassName = '',
    contentClassName = '',
    icon,
    showCaret = true,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Use controlled or uncontrolled state
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    const toggleDropdown = () => {
        const newState = !isOpen;
        if (onToggle) {
            onToggle(newState);
        } else {
            setInternalIsOpen(newState);
        }
    };

    const closeDropdown = () => {
        if (onToggle) {
            onToggle(false);
        } else {
            setInternalIsOpen(false);
        }
    };

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                closeDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    // Calculate position
    useEffect(() => {
        if (isOpen && position === 'auto' && dropdownRef.current && contentRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const contentHeight = contentRef.current.scrollHeight;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < contentHeight && spaceAbove > contentHeight) {
                setDropdownPosition('top');
            } else {
                setDropdownPosition('bottom');
            }
        } else if (position !== 'auto') {
            setDropdownPosition(position);
        }
    }, [isOpen, position]);

    // Handle item selection
    const handleItemSelect = (item: DropdownMenuItem) => {
        if (item.disabled) return;

        if (item.onClick) {
            item.onClick();
        }

        if (onSelect) {
            onSelect(item);
        }

        if (closeOnSelect) {
            closeDropdown();
        }
    };

    // Build CSS classes
    const dropdownClasses = [
        'dropdown',
        `dropdown--${variant}`,
        `dropdown--${size}`,
        `dropdown--rounded-${borderRadius}`,
        bordered ? 'dropdown--bordered' : 'dropdown--no-border',
        fullWidth ? 'dropdown--full-width' : '',
        className
    ].filter(Boolean).join(' ');

    const triggerClasses = [
        'dropdown__trigger',
        isOpen ? 'dropdown__trigger--open' : '',
        disabled ? 'dropdown__trigger--disabled' : '',
        triggerClassName
    ].filter(Boolean).join(' ');

    const contentClasses = [
        'dropdown__content',
        isOpen ? 'dropdown__content--open' : '',
        dropdownPosition === 'top' ? 'dropdown__content--above' : '',
        contentClassName
    ].filter(Boolean).join(' ');

    // Render trigger content
    const renderTrigger = () => {
        if (trigger) {
            return trigger;
        }

        const selectedItem = items.find(item =>
            isMenuItem(item) && item.selected
        ) as DropdownMenuItem | undefined;

        return (
            <>
                {icon && <span className="dropdown__trigger-icon">{icon}</span>}
                <span className="dropdown__trigger-text">
                    {selectedItem ? selectedItem.label : placeholder}
                </span>
                {showCaret && (
                    <span className={`dropdown__icon ${isOpen ? 'dropdown__icon--open' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                )}
            </>
        );
    };

    // Render menu items
    const renderMenuItems = () => {
        return items.map((item) => {
            if (isDivider(item)) {
                return <div key={item.id} className="dropdown__divider" />;
            }

            const menuItem = item;
            const itemClasses = [
                'dropdown__item',
                menuItem.selected ? 'dropdown__item--selected' : '',
                menuItem.disabled ? 'dropdown__item--disabled' : ''
            ].filter(Boolean).join(' ');

            return (
                <button
                    key={menuItem.id}
                    className={itemClasses}
                    onClick={() => handleItemSelect(menuItem)}
                    disabled={menuItem.disabled}
                    type="button"
                >
                    {menuItem.icon && (
                        <span className="dropdown__item-icon">{menuItem.icon}</span>
                    )}
                    <span className="dropdown__item-text">{menuItem.label}</span>
                </button>
            );
        });
    };

    // Render content
    const renderContent = () => {
        if (children) {
            return children;
        }

        if (template && templateData) {
            return template(templateData);
        }

        return (
            <div className="dropdown__menu">
                {renderMenuItems()}
            </div>
        );
    };

    return (
        <div ref={dropdownRef} className={dropdownClasses}>
            <button
                type="button"
                className={triggerClasses}
                onClick={toggleDropdown}
                disabled={disabled}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {renderTrigger()}
            </button>

            <div ref={contentRef} className={contentClasses}>
                {renderContent()}
            </div>
        </div>
    );
};

// Helper component for creating dropdown items
export const createDropdownItem = (
    id: string,
    label: string,
    options: Partial<Omit<DropdownMenuItem, 'id' | 'label'>> = {}
): DropdownMenuItem => ({
    id,
    label,
    ...options
});

// Helper component for creating dividers
export const createDropdownDivider = (id: string): DropdownDivider => ({
    type: 'divider',
    id
});

export default Dropdown;
