export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    title?: string;
    message: string;
    timeout?: number; // em segundos, 0 = nunca remove automaticamente
    actions?: NotificationAction[];
}

export interface NotificationAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export interface NotificationState {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => string;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}
