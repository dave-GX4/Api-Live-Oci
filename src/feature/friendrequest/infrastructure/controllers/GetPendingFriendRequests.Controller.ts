import { Request, Response } from "express";
import GetPendingFriendRequestsUseCase from "../../application/usecases/GetPendingFriendRequests.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class GetPendingFriendRequestsController {
    constructor(
        private readonly useCase: GetPendingFriendRequestsUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id as string; 
            
            if (!id || typeof id !== 'string') {
                throw new InvalidError("El ID del usuario es requerido en la URL");
            }

            // Ejecutamos el caso de uso
            const requests = await this.useCase.run(id);

            return res.status(200).json({ 
                success: true, 
                data: requests 
            });
            
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json({
                    success: false,
                    error: error.message
                });
            }

            // Error genérico por si falla algo inesperado (Ej: Cloudinary caído)
            console.error('Error inesperado en GetPendingFriendRequestsController:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}