import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import NotificationRepository from "../../domain/Notification.Repository";
import Notification from "../../domain/entity/Notification";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import { NotificationType } from "../../domain/entity/enums/NotificationType";
import { NotificationChannel } from "../../domain/entity/enums/NotificationChannel";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class NotificationMySqlPersistence implements NotificationRepository {
    constructor(
        private readonly pool: Pool
    ) {}

    async saveNotification(notification: Notification): Promise<void> {
        try {
            const query = `
                INSERT INTO notifications 
                (id, userId, type, title, body, data, isRead, channel, createdAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE(?, NOW()))
            `;
            
            // Convertimos el Record<string, any> a un string JSON para MySQL
            const dataJson = notification.data ? JSON.stringify(notification.data) : null;

            await this.pool.execute(query, [
                notification.id,
                notification.userId,
                notification.type,
                notification.title,
                notification.body,
                dataJson,
                notification.read,
                notification.channel,
                notification.createdAt || null
            ]);

        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async findNotificationByUserId(userId: string, limit: number = 20): Promise<Notification[]> {
        try {
            const query = `
                SELECT id, userId, type, title, body, data, isRead, channel, createdAt 
                FROM notifications 
                WHERE userId = ? 
                ORDER BY createdAt DESC 
                LIMIT ?
            `;

            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId, limit.toString()]);

            return rows.map(row => {
                // MySQL devuelve el JSON como string o como objeto dependiendo del driver, validamos por seguridad
                let parsedData: Record<string, any> | undefined = undefined;
                
                if (row.data) {
                    parsedData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
                }

                return {
                    id: row.id,
                    userId: row.userId,
                    type: row.type as NotificationType,
                    title: row.title,
                    body: row.body,
                    data: parsedData,
                    read: row.isRead === true,
                    channel: row.channel as NotificationChannel,
                    createdAt: row.createdAt
                };
            });

        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async markAsRead(notificationId: string): Promise<void> {
        try {
            const query = `UPDATE notifications SET isRead = true WHERE id = ?`;
            
            const [result] = await this.pool.execute<ResultSetHeader>(query, [notificationId]);

            if (result.affectedRows === 0) {
                throw new NotFoundError('Notificación', notificationId);
            }

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new DatabaseOperationError(error);
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        try {
            const query = `UPDATE notifications SET isRead = true WHERE userId = ? AND isRead = false`;
            
            await this.pool.execute(query, [userId]);
            
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async deleteByRequestId(requestId: string): Promise<void> {
        try {
            const query = `
                DELETE FROM notifications 
                WHERE type = 'friend_request' 
                AND JSON_UNQUOTE(JSON_EXTRACT(data, '$.requestId')) = ?
            `;
            await this.pool.execute(query, [requestId]);
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }
}