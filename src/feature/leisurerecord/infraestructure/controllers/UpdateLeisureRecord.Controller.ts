import { Request, Response } from "express";
import UpdateLeisureRecordUseCase from "../../application/usescases/UpdateLeisureRecord.UseCase";
import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class UpdateLeisureRecordController {
    constructor(
        private readonly updateUseCase: UpdateLeisureRecordUseCase
    ) {}

    async run(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const { id: userId } = req.body;
            
            if (!id || typeof id !== 'string') {
                throw new InvalidError("ID de registro no válido");
            }

            const {
                scheduleDate,
                startTime,
                endTime,
                satisfaction,
                status
            } = req.body;

            const response = await this.updateUseCase.run(
                id,
                userId,
                {
                    scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
                    startTime,
                    endTime,
                    satisfaction,
                    status
                }
            );

            return res.status(200).json(response);

        } catch (error) {
            if (error instanceof InvalidError) {
                return res.status(400).json({ status: false, message: error.message });
            }
            if (error instanceof NotFoundError) {
                return res.status(404).json({ status: false, message: error.message });
            }
            if (error instanceof DatabaseOperationError) {
                return res.status(500).json({ status: false, message: error.message });
            }
            return res.status(500).json({ status: false, message: "Error en el servicio" });
        }
    }
}