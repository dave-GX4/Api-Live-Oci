import { Request, Response } from "express";
import AddScheduleUsesCase from "../../application/usescases/AddSchedule.UseCase";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class AddScheduleController {
    constructor(
        private readonly addUseCase: AddScheduleUsesCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            // ✅ Validación segura del ID
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError("No se encontró identificador de usuario");
            }

            const {
                title,
                day,
                startTime,
                endTime,
                active,
                type
            } = req.body;

            const days = Array.isArray(day) ? day : [day].filter(Boolean);
            
            const activeBool = typeof active === 'string'
                ? active === 'true' 
                : Boolean(active);

            const response = await this.addUseCase.run(
                id,
                title,
                days,
                startTime,
                endTime,
                activeBool,
                type
            );

            return res.status(201).json(response);
            
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