import { Request, Response } from "express";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UpdateScheduleUseCase from "../../application/usescases/UpdateSchedule.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class UpdateScheduleController{
    constructor(
        private readonly updateUseCase :   UpdateScheduleUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const {id} = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador");
            }

            const{
                title,
                day,
                start_time,
                end_time,
                active
            } = req.body

            const response = await this.updateUseCase.run(id as string, title, day, start_time, end_time, active);

            return res.status(200).json(response)
            
        } catch (error) {
            if(error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                )
            }

            if (error instanceof NotFoundError) {
                return res.status(409).json(
                    { message: error.message }
                )
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json(
                    { message: error.message }
                )
            }

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });

        }
    }
}