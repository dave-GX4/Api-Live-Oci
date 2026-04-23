import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import FriendRequestUpdateUseCase from "../../application/usecases/FriendRequestUpdate.UseCase";

export default class FriendRequestUpdateController {
    constructor(
        private readonly useCase: FriendRequestUpdateUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { status, userId } = req.body;

            if (!id || typeof id !== 'string') {
                throw new InvalidError('El ID de la solicitud es requerido en la URL');
            }

            if (!status || typeof status !== 'string') {
                throw new InvalidError('El estado es requerido en el body');
            }

            if (!userId) {
                throw new InvalidError('No se apodido verificar tu identidad');
            }

            const response = await this.useCase.run(id, userId, status);

            return res.status(202).json(response)

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

            console.error('Error inesperado en FriendRequestUpdateController:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}