import { Request, Response } from "express";
import SingUpUseCase from "../../applicaticon/usescases/Sing.Up.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { ExistsError } from "../../../../core/errors/ExistsError";

export default class SingUpController {
    constructor(
        private readonly useCase: SingUpUseCase,
    ) { }

    async run(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = await this.useCase.run(body)

            return res.status(201).json(result)
        } catch (error) {
            if(error instanceof ExistsError){
                return res.status(400).json({
                    status: false,
                    message: error.message
                })
            }

            if (error instanceof InvalidError) {
                return res.status(400).json({
                    status: false,
                    message: error.message 
                 })
            }

            return res.status(500).json({
                status: false,
                message: "Error interno inesperado en el servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}