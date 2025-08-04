import { useCallback } from 'react';
import { useNotificationStore } from '../stores/notification.store';
import type { NotificationType, NotificationAction } from '../types/notification';

interface UseNotificationOptions {
    title?: string;
    timeout?: number;
    actions?: NotificationAction[];
}

export const useNotification = () => {
    const { addNotification, removeNotification, clearAll } = useNotificationStore();

    const notify = useCallback((
        type: NotificationType,
        message: string,
        options?: UseNotificationOptions
    ) => {
        return addNotification({
            type,
            message,
            title: options?.title,
            timeout: options?.timeout,
            actions: options?.actions,
        });
    }, [addNotification]);

    const success = useCallback((message: string, options?: UseNotificationOptions) => {
        return notify('success', message, options);
    }, [notify]);

    const error = useCallback((message: string, options?: UseNotificationOptions) => {
        return notify('error', message, options);
    }, [notify]);

    const warning = useCallback((message: string, options?: UseNotificationOptions) => {
        return notify('warning', message, options);
    }, [notify]);

    const info = useCallback((message: string, options?: UseNotificationOptions) => {
        return notify('info', message, options);
    }, [notify]);

    const close = useCallback((id: string) => {
        removeNotification(id);
    }, [removeNotification]);

    const closeAll = useCallback(() => {
        clearAll();
    }, [clearAll]);

    return {
        notify,
        success,
        error,
        warning,
        info,
        close,
        closeAll,
    };
};
