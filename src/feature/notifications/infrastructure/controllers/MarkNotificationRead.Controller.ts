import { Request, Response } from "express";
import MarkNotificationReadUseCase from "../../application/usescases/MarkNotificationRead.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class MarkNotificationReadController {
    constructor(
        private readonly useCase: MarkNotificationReadUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const notificationId = req.params.id as string;

            if (!notificationId) {
                throw new InvalidError('El ID de la notificación es requerido en los parámetros de la ruta');
            }

            const response = await this.useCase.run(notificationId);

            return res.status(200).json(response);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[MarkNotificationRead] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof NotFoundError) {
                console.warn(`[MarkNotificationRead] NotFound: ${error.message}`);
                return res.status(404).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[MarkNotificationRead] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: error.message });
            }

            console.error('[MarkNotificationRead] Error inesperado:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}