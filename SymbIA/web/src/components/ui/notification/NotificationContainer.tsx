import React from 'react';
import { useNotificationStore } from '../../../stores/notification.store';
import { NotificationItem } from './NotificationItem';
// using global framework styles

export const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotificationStore();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={removeNotification}
                />
            ))}
        </div>
    );
};
