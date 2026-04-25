import { Request, Response } from "express";
import SearchUserByCodeUseCase from "../../application/usecases/SearchUserByCode.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class SearchUserByCodeController{
    constructor(
        private readonly useCase: SearchUserByCodeUseCase
    ){}

    async run(req: Request, res: Response): Promise<Response>{
        try {
            const id = req.params.id as string;
            const { code } = req.body;

            if (!id) {
                throw new InvalidError('El ID del usuario es requerido en la URL');
            }

            if (!code || typeof code !== 'string') {
                throw new InvalidError('El código es requerido en el body');
            }

            const result = await this.useCase.run(id, code);

            return res.status(200).json(result);
        } catch (error) {
            
            if (error instanceof NotFoundError) {
                console.warn(`[SearchUser] Not Found: ${error.message}`);
                return res.status(404).json({ success: false, error: error.message });
            }

            if (error instanceof InvalidError) {
                console.warn(`[SearchUser] Invalid: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[SearchUser] DB Error:`, error);
                return res.status(500).json({ success: false, error: error.message });
            }

            console.error('Error inesperado en SearchUserByCodeController:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}