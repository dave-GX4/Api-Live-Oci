import { NotificationChannel } from "./enums/NotificationChannel";
import { NotificationType } from "./enums/NotificationType";

export default interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, any>;
    read: boolean;
    channel: NotificationChannel;
    createdAt?: Date;
}