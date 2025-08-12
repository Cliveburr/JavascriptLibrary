import { useEffect, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
    type?: NotificationType;
    duration?: number;
    title?: string;
}

let notificationHandler: ((message: string, options?: NotificationOptions) => void) | null = null;

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Array<{
        id: string;
        message: string;
        type: NotificationType;
        title?: string;
    }>>([]);

    const show = (message: string, options: NotificationOptions = {}) => {
        const id = Date.now().toString();
        const notification = {
            id,
            message,
            type: options.type || 'info',
            title: options.title
        };

        setNotifications(prev => [...prev, notification]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, options.duration || 5000);
    };

    useEffect(() => {
        notificationHandler = show;
        return () => {
            notificationHandler = null;
        };
    }, []);

    const remove = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return { notifications, show, remove };
};

export const notify = {
    success: (message: string, title?: string) => {
        notificationHandler?.(message, { type: 'success', title });
    },
    error: (message: string, title?: string) => {
        notificationHandler?.(message, { type: 'error', title });
    },
    warning: (message: string, title?: string) => {
        notificationHandler?.(message, { type: 'warning', title });
    },
    info: (message: string, title?: string) => {
        notificationHandler?.(message, { type: 'info', title });
    }
};
