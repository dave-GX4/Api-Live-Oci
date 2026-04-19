import { Request, Response } from "express";
import ExternalApiError from "../../../../core/errors/ExternalApiError";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import DeletePhotoUseCase from "../../application/usecases/DeletePhoto.UseCase";

export default class DeletePhotoController {
    constructor(
        private readonly usecase: DeletePhotoUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;

            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                throw new InvalidError("No se encontró ningún identificador de usuario");
            }

            await this.usecase.execute(userId);

            return res.status(204).send();

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

            console.error("Unexpected Error in DeletePhotoController:", error);
            return res.status(500).json({
                message: "Ocurrió un error inesperado en el servidor",
                status: 500
            });
        }
    }
}