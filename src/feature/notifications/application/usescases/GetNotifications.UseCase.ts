import InvalidError from "../../../../core/errors/InvalidError";
import Notification from "../../domain/entity/Notification";
import NotificationRepository from "../../domain/Notification.Repository";

export default class GetNotificationsUseCase {
    constructor(
        private readonly notificationRepository: NotificationRepository
    ) {}

    async run(userId: string, limit: number = 20): Promise<Notification[]> {
        if (!userId || typeof userId !== 'string') {
            throw new InvalidError('El identificador del usuario es inválido');
        }

        // const validUserId = UUID.validate(userId).getValue();

        const notifications = await this.notificationRepository.findNotificationByUserId(userId, limit);

        return notifications;
    }
}