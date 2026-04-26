import pool from "../../../core/config/data.base.conection";
import GetNotificationsUseCase from "../application/usescases/GetNotifications.UseCase";
import MarkAllNotificationsReadUseCase from "../application/usescases/MarkAllNotificationsRead.UseCase";
import MarkNotificationReadUseCase from "../application/usescases/MarkNotificationRead.UseCase";
import GetNotificationsController from "./controllers/GetNotifications.Controller";
import MarkAllNotificationsReadController from "./controllers/MarkAllNotificationsRead.Controller";
import MarkNotificationReadController from "./controllers/MarkNotificationRead.Controller";
import NotificationMySqlPersistence from "./db/Notification.My.SQL.Persistence";

const mySqlNotificationPersistence = new NotificationMySqlPersistence(pool);

const getNotificationsUseCase = new GetNotificationsUseCase(mySqlNotificationPersistence);
const markAllNotificationsReadUseCase = new MarkAllNotificationsReadUseCase(mySqlNotificationPersistence);
const markNotificationReadUseCase = new MarkNotificationReadUseCase(mySqlNotificationPersistence);

export const markNotificationReadController = new MarkNotificationReadController(markNotificationReadUseCase);
export const markAllNotificationsReadController = new MarkAllNotificationsReadController(markAllNotificationsReadUseCase);
export const getNotificationsController = new GetNotificationsController(getNotificationsUseCase);