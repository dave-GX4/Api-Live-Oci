import { Request, Response } from "express";
import UpdateUserUseCase from "../../application/usescases/UpdateUser.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class UpdateUserController{
    constructor(
        private readonly updateUseCase : UpdateUserUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError("No se encontró ningún identificador");
            }

            const {
                name,
                email,
                password,
                notifications,
                interests,
                topics,
                description,
                leisureType
            } = req.body;

            if (interests !== undefined && !Array.isArray(interests)) {
                throw new InvalidError("interests debe ser un array");
            }
            if (topics !== undefined && !Array.isArray(topics)) {
                throw new InvalidError("topics debe ser un array");
            }

            const response = await this.updateUseCase.run(
                id as string,
                name,
                email,
                password,
                notifications,
                interests,
                topics,
                description,
                leisureType
            );

            return res.status(200).json(response);
        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json(
                    { message: "Error de validacion: " + error.message }
                )
            }

            if (error instanceof NotFoundError) {
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