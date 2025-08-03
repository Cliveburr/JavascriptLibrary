import React from 'react';
import './Card.scss';

export interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
    glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
    glow = false,
}) => {
    const baseClass = 'card';
    const variantClass = `card--${variant}`;
    const paddingClass = `card--padding-${padding}`;
    const glowClass = glow ? 'card--glow' : '';

    const classes = [baseClass, variantClass, paddingClass, glowClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {children}
        </div>
    );
};
