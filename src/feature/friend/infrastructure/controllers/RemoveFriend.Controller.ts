import { Request, Response } from "express";
import RemoveFriendUseCase from "../../application/usecases/RemoveFriend.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class RemoveFriendController {
    constructor(
        private readonly useCase: RemoveFriendUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const friendshipId = req.params.friendshipId as string;
            
            const requestUserId = req.body.userId || req.query.userId; 

            if (!friendshipId) {
                throw new InvalidError('El ID de la amistad (friendshipId) es requerido en la ruta');
            }

            if (!requestUserId || typeof requestUserId !== 'string') {
                throw new InvalidError('El ID del usuario que realiza la acción (userId) es requerido');
            }

            const response = await this.useCase.run(friendshipId, requestUserId);

            return res.status(200).json(response);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[RemoveFriend] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof NotFoundError) {
                console.warn(`[RemoveFriend] NotFound: ${error.message}`);
                return res.status(404).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[RemoveFriend] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: 'Error en la base de datos' });
            }

            console.error('[RemoveFriend] Error inesperado:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}