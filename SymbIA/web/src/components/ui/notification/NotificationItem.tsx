import React, { useEffect, useState } from 'react';
import type { Notification as NotificationData } from '../../../types/notification';
import './NotificationItem.scss';

interface NotificationItemProps {
    notification: NotificationData;
    onClose: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onClose(notification.id);
        }, 300); // Match animation duration
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'info':
                return (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`notification-item notification-item--${notification.type} ${isVisible && !isRemoving ? 'notification-item--visible' : ''
                } ${isRemoving ? 'notification-item--removing' : ''}`}
        >
            <div className="notification-item__icon">
                {getIcon()}
            </div>

            <div className="notification-item__content">
                {notification.title && (
                    <div className="notification-item__title">
                        {notification.title}
                    </div>
                )}
                <div className="notification-item__message">
                    {notification.message}
                </div>

                {notification.actions && notification.actions.length > 0 && (
                    <div className="notification-item__actions">
                        {notification.actions.map((action, index) => (
                            <button
                                key={index}
                                className={`notification-item__action notification-item__action--${action.variant || 'secondary'}`}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button
                className="notification-item__close"
                onClick={handleClose}
                aria-label="Fechar notificação"
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </button>
        </div>
    );
};
