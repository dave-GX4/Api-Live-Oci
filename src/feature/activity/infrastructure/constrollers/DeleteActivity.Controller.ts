import { Request, Response } from "express";
import DeleteActivityUseCase from "../../application/usecases/DeleteActivity.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class DeleteActivityController{
    constructor(
        private readonly deleteUseCase : DeleteActivityUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const {id} = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador");
            }

            const response = await this.deleteUseCase.run(id as string);

            return res.status(200).json(response);
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validacion: " + error.message 
                })
            }

            if (error instanceof NotFoundError) {
                return res.status(409).json({ 
                    status: false,
                    message: error.message 
                })
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json({
                    status: false, 
                    message: error.message 
                })
            }

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}