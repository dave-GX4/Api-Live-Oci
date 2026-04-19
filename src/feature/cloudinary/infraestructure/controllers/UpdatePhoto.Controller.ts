import { Request, Response } from "express";
import UpdatePhotoUseCase from "../../application/usecases/UpdatePhoto.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import ExternalApiError from "../../../../core/errors/ExternalApiError";
import MulterRequest from "../../application/dtos/MulterRequest";

export default class UpdatePhotoController {
    constructor(
        private readonly usecase: UpdatePhotoUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const file = (req as MulterRequest).file?.buffer;

            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                throw new InvalidError("No se encontró ningún identificador de usuario");
            }

            if (!file) {
                throw new InvalidError("No se proporcionó ninguna imagen para actualizar");
            }

            const response = await this.usecase.execute({
                userId,
                file
            });

            return res.status(200).json(response);

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

            console.error("Unexpected Error in UpdatePhotoController:", error);
            return res.status(500).json({
                message: "Ocurrió un error inesperado en el servidor",
                status: 500
            });
        }
    }
}