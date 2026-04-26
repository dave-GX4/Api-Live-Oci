import InvalidError from "../../../../core/errors/InvalidError";
import NotificationRepository from "../../domain/Notification.Repository";

export default class MarkNotificationReadUseCase {
    constructor(
        private readonly notificationRepository: NotificationRepository
    ) {}

    async run(notificationId: string): Promise<{message: string, success: boolean; }> {
        if (!notificationId || typeof notificationId !== 'string') {
            throw new InvalidError('El identificador de la notificación es inválido');
        }

        await this.notificationRepository.markAsRead(notificationId);

        return {
            message: 'Notificación marcada como leída',
            success: true
        };
    }
}