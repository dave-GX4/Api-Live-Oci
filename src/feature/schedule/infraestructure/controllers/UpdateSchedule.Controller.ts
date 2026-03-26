import { Request, Response } from "express";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UpdateScheduleUseCase from "../../application/usescases/UpdateSchedule.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class UpdateScheduleController {
    constructor(
        private readonly updateUseCase: UpdateScheduleUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError("No se encontró identificador del horario");
            }

            const {
                title,
                days,
                startTime,
                endTime,
                active
            } = req.body;

            const activeBool = active === 1 || active === '1' || active === true;

            if (days !== undefined && !Array.isArray(days)) {
                throw new InvalidError("days debe ser un array de números");
            }

            const response = await this.updateUseCase.run(
                id,
                title,
                days,
                startTime,
                endTime,
                activeBool
            );

            return res.status(200).json(response);
            
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validación: " + error.message
                });
            }

            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: false,
                    message: error.message
                });
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json({
                    status: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                status: false,
                message: "Error en el servicio. Intente más tarde."
            });
        }
    }
}