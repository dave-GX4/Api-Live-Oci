import { Request, Response } from "express";
import GetActivityByKeyUseCase from "../../application/usescases/GetActivityByKey.UseCase";
import ExternalApiError from "../../../../core/errors/ExternalApiError";
import InvalidError from "../../../../core/errors/InvalidError";

export default class GetActivityByKeyController {
    constructor(private readonly useCase: GetActivityByKeyUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { key } = req.params;

            if (!key || Number.isNaN(Number(key))) {
                throw new InvalidError("La llave de actividad debe ser un formato numérico válido.");
            }

            const response = await this.useCase.run(Number(key));
            return res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                )
            }
            const status = error instanceof ExternalApiError ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}