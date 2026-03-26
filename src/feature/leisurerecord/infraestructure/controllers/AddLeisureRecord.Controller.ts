import { Request, Response } from "express";
import AddLeisureRecordUseCase from "../../application/usescases/AddLeisureRecord.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class AddLeisureRecordController{
    constructor(
        private readonly addUseCase : AddLeisureRecordUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const {
                id_user,
                id_activitie,
                start_time,
                end_time,
                duration_minutes,
                saticfaction,
                status
            } = req.body;

            const response = await this.addUseCase.run(
                id_user, 
                id_activitie, 
                start_time, end_time, 
                duration_minutes, 
                saticfaction, 
                status
            );

            return res.status(200).json(response);

        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                );
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json(
                    { message: error.message }
                );
            }

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}