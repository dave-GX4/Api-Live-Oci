import { Request, Response } from "express";
import GetFilterActivityUseCase from "../../application/usescases/GetFilterActivity.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import ExternalApiError from "../../../../core/errors/ExternalApiError";

export default class GetFilterActivityController {
    constructor(private readonly useCase: GetFilterActivityUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const type = req.query.type as string;
            const participantsRaw = req.query.participants as string;

            if (!type && !participantsRaw) {
                throw new InvalidError("Se requiere al menos un parámetro de filtro (type o participants).");
            }

            const participants = participantsRaw ? Number.parseInt(participantsRaw, 10) : undefined;

            if (participants !== undefined && (Number.isNaN(participants) || participants <= 0)) {
                throw new InvalidError("El número de participantes debe ser un entero positivo.");
            }

            const response = await this.useCase.run(type, participants || 0);
            return res.status(200).json(response);
        } catch (error: any) {
            const status = error instanceof ExternalApiError ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}