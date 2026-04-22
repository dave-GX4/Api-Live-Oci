import { NotificationChannel } from "./enums/NotificationChannel";
import { NotificationType } from "./enums/NotificationType";

interface Notification {
  id: string;
  recipient_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  read: boolean;
  channel: NotificationChannel;
  created_at: Date;
}