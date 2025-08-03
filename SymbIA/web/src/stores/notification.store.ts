import { create } from 'zustand';
import type { Notification, NotificationState } from '../types/notification';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    addNotification: (notification) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newNotification: Notification = {
            ...notification,
            id,
            timeout: notification.timeout ?? 15, // Default 15 segundos
        };

        set(state => ({
            notifications: [...state.notifications, newNotification]
        }));

        // Auto-remove se timeout > 0
        if (newNotification.timeout && newNotification.timeout > 0) {
            setTimeout(() => {
                get().removeNotification(id);
            }, newNotification.timeout * 1000);
        }

        return id;
    },

    removeNotification: (id) => {
        set(state => ({
            notifications: state.notifications.filter(notification => notification.id !== id)
        }));
    },

    clearAll: () => {
        set({ notifications: [] });
    },
}));
