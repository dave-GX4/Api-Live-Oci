import InvalidError from "../../../../core/errors/InvalidError";
import NotificationRepository from "../../domain/Notification.Repository";

export default class MarkAllNotificationsReadUseCase {
    constructor(
        private readonly notificationRepository: NotificationRepository
    ) {}

    async run(userId: string): Promise<{ success: boolean; message: string }> {
        if (!userId || typeof userId !== 'string') {
            throw new InvalidError('El identificador del usuario es inválido');
        }

        await this.notificationRepository.markAllAsRead(userId);

        return {
            message: 'Todas las notificaciones han sido marcadas como leídas',
            success: true
        };
    }
}