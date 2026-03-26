import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import CreateActivityUseCase from "../../application/usecases/CreateActivity.UseCases";

export default class CreateActivityController{
    constructor(
        private readonly createUseCase : CreateActivityUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError("No se encontró ningún identificador de usuario");
            }

            const {
                name, 
                description, 
                type, 
                category, 
                durationMinutes, 
                socialType
            } = req.body;

            const response = await this.createUseCase.run(
                id,
                name,
                description,
                type,
                category,
                durationMinutes,
                socialType
            );

            return res.status(201).json(response);
            
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validación: " + error.message
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