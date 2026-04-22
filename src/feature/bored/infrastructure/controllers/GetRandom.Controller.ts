import { Request, Response } from "express";
import GetRandomUseCase from "../../application/usescases/GetRandom.UseCase";
import ExternalApiError from "../../../../core/errors/ExternalApiError";

export default class GetRandomController {
    constructor(private readonly useCase: GetRandomUseCase) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const response = await this.useCase.run();
            return res.status(200).json(response);
        } catch (error: any) {
            const status = error instanceof ExternalApiError ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}