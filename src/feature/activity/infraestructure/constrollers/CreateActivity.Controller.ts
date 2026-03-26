import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import CreateActivityUseCase from "../../application/usecases/CreateActivity.UseCases";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class CreateActivityController{
    constructor(
        private readonly createUseCase : CreateActivityUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const {id} = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador")
            }

            const {name, description, type, category, duration_minutes, social_type} = req.body

            const response = await this.createUseCase.run(id as string, name, description, type, category, duration_minutes, social_type);

            return res.status(200).json(response);
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                );
            }

            if (error instanceof NotFoundError) {
                return res.status(409).json(
                    { message: error.message }
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