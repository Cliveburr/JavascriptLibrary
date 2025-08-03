import { useNotificationStore } from '../stores/notification.store';
import type { NotificationType, NotificationAction } from '../types/notification';

interface UseNotificationOptions {
    title?: string;
    timeout?: number;
    actions?: NotificationAction[];
}

export const useNotification = () => {
    const { addNotification, removeNotification, clearAll } = useNotificationStore();

    const notify = (
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
    };

    const success = (message: string, options?: UseNotificationOptions) => {
        return notify('success', message, options);
    };

    const error = (message: string, options?: UseNotificationOptions) => {
        return notify('error', message, options);
    };

    const warning = (message: string, options?: UseNotificationOptions) => {
        return notify('warning', message, options);
    };

    const info = (message: string, options?: UseNotificationOptions) => {
        return notify('info', message, options);
    };

    const close = (id: string) => {
        removeNotification(id);
    };

    const closeAll = () => {
        clearAll();
    };

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
