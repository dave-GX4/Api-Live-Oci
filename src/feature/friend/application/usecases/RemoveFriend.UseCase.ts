import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import FriendRepository from "../../domain/Fiend.Repository";
import FriendRequestNotifier from "../services/FriendRequestNotifier";

export default class RemoveFriendUseCase {
    constructor(
        private readonly friendRepository: FriendRepository,
        private readonly sseNotifier: FriendRequestNotifier
    ) {}

    async run(friendshipId: string, requestUserId: string): Promise<{ success: boolean; message: string }> {
        // Buscamos la relación
        const friendship = await this.friendRepository.findById(friendshipId);
        if (!friendship) {
            throw new NotFoundError('Amistad', friendshipId, 'ID');
        }

        // Validamos que estén aceptados (son amigos)
        if (friendship.status !== 'accepted') {
            throw new InvalidError('No puedes eliminar una amistad que no ha sido aceptada');
        }

        const requesterId = friendship.requesterId.getValue();
        const addresseeId = friendship.addresseeId.getValue();

        // Validamos que el que intenta borrar sea parte de la relación
        if (requestUserId !== requesterId && requestUserId !== addresseeId) {
            throw new InvalidError('No tienes permiso para eliminar esta amistad');
        }

        // Borramos de la base de datos
        await this.friendRepository.delete(friendshipId);

        // ¡Avisamos por SSE al otro usuario para que se le borre de la pantalla!
        try {
            // Identificamos quién es el "otro"
            const otherUserId = requestUserId === requesterId ? addresseeId : requesterId;
            
            // Reutilizamos el evento que ya tenías en GlobalSseManager para borrar/añadir
            this.sseNotifier.notifyFriendAdded(otherUserId, {
                action: 'REMOVED',
                friendshipId: friendshipId,
                removedUserId: requestUserId
            });
        } catch (error) {
            console.error("[RemoveFriend] Error notificando por SSE:", error);
        }

        return {
            success: true,
            message: 'Amigo eliminado correctamente'
        };
    }
}