import { Request, Response } from "express";
import GetFriendsListUseCase from "../../application/usecases/GetFriendsList.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class GetFriendsListController {
    constructor(
        private readonly useCase: GetFriendsListUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.userId as string;

            if (!id) {
                throw new InvalidError('El ID del usuario es requerido en la ruta');
            }

            const friends = await this.useCase.run(id);

            return res.status(200).json(friends);

        } catch (error) {
            if (error instanceof InvalidError) {
                console.warn(`[GetFriendsList] InvalidRequest: ${error.message}`);
                return res.status(400).json({ success: false, error: error.message });
            }

            if (error instanceof DatabaseOperationError) {
                console.error(`[GetFriendsList] DB_ERROR:`, error);
                return res.status(500).json({ success: false, error: 'Error en la base de datos' });
            }

            console.error('[GetFriendsList] Error inesperado:', error);
            return res.status(500).json({ success: false, error: 'Error interno del servidor' });
        }
    }
}