import { Request, Response } from "express";
import DeleteAccountUseCase from "../../application/usescases/DeleteAccount.UsesCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { ExistsError } from "../../../../core/errors/ExistsError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class DeleteAccountController {
    constructor(
        private readonly deleteUseCase: DeleteAccountUseCase
    ) { }

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError("No se encontro ningun identificador")
            }

            const response = await this.deleteUseCase.run(id as string)

            return res.status(200).json(response)
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                )
            }

            if (error instanceof ExistsError) {
                return res.status(409).json(
                    { message: error.message }
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