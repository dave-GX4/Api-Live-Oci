import { Request, Response } from "express";
import InvalidError from "../../../../core/errors/InvalidError";
import GetFriendCodeUseCase from "../../application/usecases/GetFriendCode.UseCase";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import IGlobalConnectionManager from "../../../../core/services/interface/I.GlobalConnectionManager";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class GetCodeController {
    constructor(
        private readonly getFriendCodeUseCase: GetFriendCodeUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.params.id as string;
            
            if (!userId) {
                throw new InvalidError("No se encontró tu identificador");
            }

            // Ejecuta el caso de uso que va a la base de datos
            const currentCode = await this.getFriendCodeUseCase.execute(userId);

            return res.status(200).json(currentCode);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[GetCode] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof NotFoundError) {
                console.warn(`[GetCode] NotFound: ${error.message}`);
                return res.status(404).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[GetCode] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: "Error en la base de datos" });
            }

            console.error('[GetCode] Error inesperado:', error);
            return res.status(500).json({ success: false, error: "Error interno del servidor" });
        }
    }
}