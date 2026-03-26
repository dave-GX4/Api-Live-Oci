import { Request, Response } from "express";
import SingInUseCase from "../../applicaticon/usescases/sing_In_UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { ExistsError } from "../../../../core/errors/ExistsError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class SingInController {
    constructor(
        private readonly useCase: SingInUseCase
    ) { }

    async run(req: Request, res: Response) {
        try {
            const body = req.body;

            const result = await this.useCase.run(
                body.email,
                body.password
            )

            return res.status(200).json(result)
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ 
                    status: false,
                    message: error.message 
                });
            }

            if (error instanceof InvalidError) {
                return res.status(401).json({ 
                    status: false,
                    message: error.message 
                });
            }

            if (error instanceof ExistsError) {
                return res.status(402).json({
                    status: false,
                    message: error.message 
                });
            }

            return res.status(500).json({
                status: false,
                message: "Error interno inesperado en el servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}