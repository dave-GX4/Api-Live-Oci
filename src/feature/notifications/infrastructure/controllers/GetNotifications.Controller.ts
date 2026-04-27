import { Request, Response } from "express";
import GetNotificationsUseCase from "../../application/usescases/GetNotifications.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class GetNotificationsController {
    constructor(
        private readonly useCase: GetNotificationsUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.userId as string;
            
            const limitParam = req.query.limit as string;
            const limit = limitParam ? parseInt(limitParam, 10) : 20;

            if (!userId) {
                throw new InvalidError('El ID del usuario es requerido en los parámetros de la ruta');
            }

            const notifications = await this.useCase.run(userId, isNaN(limit) ? 20 : limit);

            return res.status(200).json(notifications);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[GetNotifications] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[GetNotifications] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: error.message });
            }

            console.error('[GetNotifications] Error inesperado:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}