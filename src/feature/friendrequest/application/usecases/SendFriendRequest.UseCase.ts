import InvalidError from "../../../../core/errors/InvalidError";
import IUuidService from "../../../../core/services/interface/I.Uuid.Service";
import UUID from "../../../../core/valueobjects/UUID";
import UserRepository from "../../../user/domain/User.Repository";
import FriendRequest from "../../domain/entity/FriendRequest";
import FriendRequestRepository from "../../domain/FiendRequest.Repository";
import ResponseRequest from "../dtos/ResponseRequest";
import FriendRequestNotifier from "../services/FriendRequestNotifier";

export default class SendFriendRequestUseCase {
    constructor(
        private readonly friendRequestRepository: FriendRequestRepository,
        private readonly uuidService: IUuidService,
        private readonly userRepository: UserRepository,
        private readonly sseNotifier: FriendRequestNotifier
    ) {}


    async run(userIdA: string, userIdB: string): Promise<ResponseRequest> {
        const valueIdA = UUID.validate(userIdA);
        const valueIdB = UUID.validate(userIdB);

        if (valueIdA === valueIdB) {
            throw new InvalidError('No puedes enviarte una solicitud de amistad a ti mismo');
        }

        // Buscar si A ya envió a B (cualquier estado)
        const existingRequest = await this.friendRequestRepository.findBetweenUsers(
            valueIdA.getValue(), 
            valueIdB.getValue()
        );

        if (existingRequest) {
            const isAtoB = existingRequest.requesterId.getValue() === valueIdA.getValue();

            // Ya son amigos
            if (existingRequest.status === 'accepted') {
                throw new InvalidError('Ya eres amigo de este usuario');
            }

            // Ya existe una pendiente
            if (existingRequest.status === 'pending') {
                if (isAtoB) {
                    throw new InvalidError('Ya tienes una solicitud de amistad pendiente con este usuario');
                } else {
                    // B le envió a A, A no puede enviarle a B
                    throw new InvalidError('Este usuario ya te ha enviado una solicitud de amistad');
                }
            }

            // Fue rechazada
            if (existingRequest.status === 'rejected') {
                const now = Date.now();
                const lastUpdate = existingRequest.updatedAt?.getTime() || existingRequest.createdAt?.getTime() || now;
                const hoursSinceRejection = (now - lastUpdate) / (1000 * 60 * 60);

                if (hoursSinceRejection < 24) {
                    throw new InvalidError(
                        'Debes esperar 24 horas para volver a enviar una solicitud a este usuario'
                    );
                }

                // Pasaron 24h: permitir reenvío (el save con ON DUPLICATE KEY UPDATE manejará esto)
                // Si B rechazó a A, ahora A puede enviar de nuevo (o viceversa)
            }
        }

        const newId = await this.uuidService.generate();

        const request: FriendRequest = {
            id: newId,
            requesterId: valueIdA,
            addresseeId: valueIdB,
            status: 'pending'
        };

        await this.friendRequestRepository.save(request);

        try {
            // Buscas cómo se llama el que envió para mandarlo en la notificación
            const senderProfile = await this.userRepository.getPublicProfile(userIdA);
            
            this.sseNotifier.notifyNewRequest(userIdB, {
                id: newId,
                requesterId: userIdA,
                requesterName: senderProfile?.name || 'Alguien',
                status: 'pending',
                createdAt: new Date(),
                message: `${senderProfile?.name || 'Alguien'} te ha enviado una solicitud.`
            });
        } catch (error) {
            console.error("No se pudo notificar por SSE", error);
            // No hacemos throw aquí para que el HTTP POST no falle si falla el SSE
        }

        return { message: 'Solicitud de amistad enviada', success: true };
    }
}