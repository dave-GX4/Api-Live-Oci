import { Request, Response } from "express";
import AddScheduleUsesCase from "../../application/usescases/AddSchedule.UseCase";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class AddScheduleController{
    constructor(
        private readonly addUseCase : AddScheduleUsesCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const {id} = req.params;

            const {
                title,
                day,
                start_time,
                end_time,
                active,
                type
            } = req.body;
            
            const response = await this.addUseCase.run(id as string, title, day, start_time, end_time, active, type);

            return res.status(200).json(response)
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validacion: " + error.message
                });
            }

            if (error instanceof NotFoundError) {
                return res.status(409).json({
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

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}