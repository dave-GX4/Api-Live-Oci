import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { RequestStatus } from "../../domain/entity/enums/Request.Status";
import FriendRequestRepository from "../../domain/FiendRequest.Repository";
import ResponseRequest from "../dtos/ResponseRequest";

export default class FriendRequestUpdateUseCase {
    constructor(
        private readonly friendRequestRepository: FriendRequestRepository
    ) {}

    async run(requestId: string, userId: string, status: string): Promise<ResponseRequest> {
        const normalizedStatus = status.toLowerCase().trim();
        
        // Validar que el estado sea válido
        if (normalizedStatus !== 'accepted' && normalizedStatus !== 'rejected') {
            throw new InvalidError('El estado debe ser "accepted" o "rejected"');
        }

        // Buscar la solicitud
        const request = await this.friendRequestRepository.findById(requestId);
        if (!request) {
            throw new NotFoundError('Solicitud de amistad', requestId, 'ID');
        }

        // Validar que quien actualiza sea el destinatario (addressee)
        if (request.addresseeId.getValue() !== userId) {
            throw new InvalidError('No tienes permiso para modificar esta solicitud');
        }

        // Validar que aún esté pendiente
        if (request.status !== 'pending') {
            throw new InvalidError(`Esta solicitud ya fue ${request.status === 'accepted' ? 'aceptada' : 'rechazada'}`);
        }

        await this.friendRequestRepository.update(requestId, normalizedStatus as RequestStatus);

        const message = normalizedStatus === 'accepted' 
            ? 'Solicitud de amistad aceptada' 
            : 'Solicitud de amistad rechazada';

        return {
            message,
            success: true
        };
    }
}