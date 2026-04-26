import { Request, Response } from "express";
import CancelFriendRequestUseCase from "../../application/usecases/CancelFriendRequest.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class CancelFriendRequestController {
    constructor(
        private readonly useCase: CancelFriendRequestUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const {userId} = req.body

            if (!id || typeof id !== 'string') {
                throw new InvalidError('El ID de la solicitud es requerido en la URL');
            }

            if (!userId) {
                throw new InvalidError('Usuario no autenticado');
            }

            const response = await this.useCase.run(id, userId);

            return res.status(200).json(response);

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

            console.error('Error inesperado en CancelFriendRequestController:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}