import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import FriendRepository from "../../domain/Fiend.Repository";
import ResponseRequest from "../dtos/ResponseRequest";

export default class CancelFriendRequestUseCase {
    constructor(
        private readonly friendRequestRepository: FriendRepository
    ) {}

    async run(requestId: string, userId: string): Promise<ResponseRequest> {
        // Buscar la solicitud
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) {
            throw new NotFoundError('Solicitud de amistad', requestId, 'ID');
        }

        // Validar que quien cancela sea quien la envió
        if (request.requesterId.getValue() !== userId) {
            throw new InvalidError('No tienes permiso para cancelar esta solicitud');
        }

        // Solo se puede cancelar si está pendiente
        if (request.status !== 'pending') {
            throw new InvalidError(
                `No puedes cancelar una solicitud que ya fue ${request.status === 'accepted' ? 'aceptada' : 'rechazada'}`
            );
        }

        await this.friendRequestRepository.delete(requestId);

        return {
            message: 'Solicitud de amistad cancelada correctamente',
            success: true
        };
    }
}