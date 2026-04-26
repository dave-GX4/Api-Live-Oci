import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import ICloudinaryService from "../../../../core/services/interface/I.Cloudinary.Service";
import IUuidService from "../../../../core/services/interface/I.Uuid.Service";
import CloudinaryRepository from "../../../cloudinary/domain/Cloudinary.Repository";
import Notification from "../../../notifications/domain/entity/Notification";
import NotificationRepository from "../../../notifications/domain/Notification.Repository";
import UserRepository from "../../../user/domain/User.Repository";
import FriendRepository from "../../domain/Fiend.Repository";
import FriendRequestNotifier from "../services/FriendRequestNotifier";

export default class FriendRequestUpdateUseCase {
    constructor(
        private readonly friendRequestRepository: FriendRepository,
        private readonly notificationRepository: NotificationRepository,
        private readonly userRepository: UserRepository,
        private readonly cloudinaryRepository: CloudinaryRepository,
        private readonly cloudinaryService: ICloudinaryService,
        private readonly uuidService: IUuidService,
        private readonly sseNotifier: FriendRequestNotifier
    ) {}

    async run(requestId: string, userId: string, status: string): Promise<{ success: boolean; message: string }> {
        const normalizedStatus = status.toLowerCase().trim();
        
        if (normalizedStatus !== 'accepted' && normalizedStatus !== 'rejected') {
            throw new InvalidError('El estado debe ser "accepted" o "rejected"');
        }

        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) {
            throw new NotFoundError('Solicitud de amistad', requestId, 'ID');
        }

        if (request.addresseeId.getValue() !== userId) {
            throw new InvalidError('No tienes permiso para modificar esta solicitud');
        }

        if (request.status !== 'pending') {
            throw new InvalidError(`Esta solicitud ya fue ${request.status === 'accepted' ? 'aceptada' : 'rechazada'}`);
        }

        // Actualizamos la BD (Pendiente -> Aceptado / Rechazado)
        await this.friendRequestRepository.update(requestId, normalizedStatus as any);

        // Borramos la notificación pendiente que tenía el Usuario B (para limpiar su campanita)
        try {
            await this.notificationRepository.deleteByRequestId(requestId);
        } catch (error) {
            console.error("[FriendRequestUpdate] Error borrando notificación previa:", error);
        }

        // SI ACEPTÓ, le avisamos al Usuario A (el que envió la solicitud original)
        if (normalizedStatus === 'accepted') {
            try {
                const requesterId = request.requesterId.getValue();
                const addresseeId = request.addresseeId.getValue();

                // Buscamos los datos de B para mostrárselos a A
                const bProfile = await this.userRepository.getPublicProfile(addresseeId);
                let bAvatarUrl: string | undefined;
                const bPhoto = await this.cloudinaryRepository.findByUserId(addresseeId);
                if (bPhoto) {
                    bAvatarUrl = await this.cloudinaryService.getUrl(bPhoto.publicId);
                }

                // Creamos la Notificación Visual para la campanita de A
                const notificationId = await this.uuidService.generate();
                const notification: Notification = {
                    id: notificationId,
                    userId: requesterId,
                    type: "friend_request" as any,
                    title: "Solicitud aceptada",
                    body: `${bProfile?.name || 'Alguien'} ha aceptado tu solicitud de amistad.`,
                    data: {
                        friendshipId: requestId,
                        friendId: addresseeId,
                        friendName: bProfile?.name || 'Alguien',
                        friendAvatarUrl: bAvatarUrl
                    },
                    read: false,
                    channel: "ws"
                };

                await this.notificationRepository.saveNotification(notification);

                // Disparamos el SSE de Notificación (Campanita)
                this.sseNotifier.notifyNewRequest(requesterId, notification);

                // Disparamos el SSE de Lista de Amigos (Para que se agregue a la pantalla de A en tiempo real)
                this.sseNotifier.notifyFriendAdded(requesterId, {
                    action: 'ADDED',
                    friendshipId: requestId,
                    friendId: addresseeId,
                    friendName: bProfile?.name || 'Alguien',
                    friendAvatarUrl: bAvatarUrl
                });

            } catch (error) {
                console.error("[FriendRequestUpdate] Error enviando SSE de aceptación:", error);
            }
        }

        return {
            message: normalizedStatus === 'accepted' ? 'Solicitud de amistad aceptada' : 'Solicitud de amistad rechazada',
            success: true
        };
    }
}