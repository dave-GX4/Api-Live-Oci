import { Request, Response } from "express";
import SendFriendRequestUseCase from "../../application/usecases/SendFriendRequest.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class SendFriendRequestController {
    constructor(private readonly useCase: SendFriendRequestUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { userIdA, userIdB } = req.body;

            if (!userIdA || typeof userIdA !== 'string') {
                throw new InvalidError('El ID del usuario que envía (userIdA) es requerido');
            }

            if (!userIdB || typeof userIdB !== 'string') {
                throw new InvalidError('El ID del usuario destino (userIdB) es requerido');
            }

            const response = await this.useCase.run(userIdA, userIdB);

            return res.status(201).json(response);

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

            console.error('Error inesperado en SendFriendRequestController:', error);
            return res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}