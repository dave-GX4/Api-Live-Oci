import { Request, Response } from "express";
import GetAllScheduleByUserUseCase from "../../application/usescases/GetAllScheduleByUser.UseCase";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import InvalidError from "../../../../core/errors/InvalidError";

export default class GetAllScheduleByUserController{
    constructor(
        private readonly getAllUseCase : GetAllScheduleByUserUseCase 
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador");
            }

            const activities = await this.getAllUseCase.run(id as string);

            return res.status(200).json(activities);
        } catch (error) {
            if (error instanceof DatabaseOperationError) {
                return res.status(500).json(
                    { message: error.message }
                )
            }

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}