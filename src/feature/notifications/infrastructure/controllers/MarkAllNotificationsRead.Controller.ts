import { Request, Response } from "express";
import MarkAllNotificationsReadUseCase from "../../application/usescases/MarkAllNotificationsRead.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class MarkAllNotificationsReadController {
    constructor(
        private readonly useCase: MarkAllNotificationsReadUseCase 
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.userId as string;

            if (!userId) {
                throw new InvalidError('El ID del usuario es requerido en los parámetros de la ruta');
            }

            const response = await this.useCase.run(userId);

            return res.status(200).json(response);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[MarkAllNotifications] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[MarkAllNotifications] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: error.message });
            }

            console.error('[MarkAllNotifications] Error inesperado:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}