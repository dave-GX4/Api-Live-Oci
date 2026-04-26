import Notification from "./entity/Notification";

export default interface NotificationRepository {
    saveNotification(notification: Notification): Promise<void>;
    findNotificationByUserId(userId: string, limit?: number): Promise<Notification[]>;
    markAsRead(notificationId: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
    deleteByRequestId(requestId: string): Promise<void>;
}