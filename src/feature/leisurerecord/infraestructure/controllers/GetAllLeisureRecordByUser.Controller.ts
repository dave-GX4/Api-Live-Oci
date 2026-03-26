import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import GetAllLeisureRecordByUserUseCase from "../../application/usescases/GetAllLeisureRecordByUser.UseCase";

export default class GetAllLeisureRecordByUserController {
    constructor(
        private readonly getAllUseCase: GetAllLeisureRecordByUserUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador");
            }

            const response = await this.getAllUseCase.run(id as string);

            return res.status(200).json(response);
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                )
            }

            if (error instanceof DatabaseOperationError) {
                return res.status(500).json(
                    { message: error.message }
                )
            }

            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}