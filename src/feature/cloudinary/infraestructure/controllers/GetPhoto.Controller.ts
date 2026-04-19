import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import GetPhotoUseCase from "../../application/usecases/GetPhoto.UseCase";

export default class GetPhotoController {
    constructor(
        private readonly usecase: GetPhotoUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;

            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                throw new InvalidError("No se encontró ningún identificador de usuario");
            }

            const response = await this.usecase.execute(userId);

            if (!response) {
                return res.status(204).send();
            }

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

            console.error("Unexpected Error in GetPhotoController:", error);
            return res.status(500).json({
                message: "Ocurrió un error inesperado en el servidor",
                status: 500
            });
        }
    }
}