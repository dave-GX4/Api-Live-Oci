import { Request, Response } from "express";
import GenerateActivityUseCase from "../../application/usescases/GenerateActivity.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import ExternalApiError from "../../../../core/errors/ExternalApiError";

export default class GenerateActivityController {
    constructor(
        private readonly usecase: GenerateActivityUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const inputData = req.body; 

            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError("No se encontró ningún identificador de usuario");
            }

            const response = await this.usecase.run(id, inputData);

            return res.status(201).json(response);

        } catch (error: any) {
            
            if (error instanceof InvalidError) {
                return res.status(400).json({
                    message: error.message,
                    status: 400
                });
            }

            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    message: error.message,
                    status: 404
                });
            }

            if (error instanceof ExternalApiError) {
                return res.status(502).json({
                    message: error.message,
                    service: error.serviceName,
                    status: 502
                });
            }

            console.error("Unexpected Error in Controller:", error);
            return res.status(500).json({
                message: "Ocurrió un error inesperado en el servidor",
                status: 500
            });
        }
    }
}