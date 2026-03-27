"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
class UpdateLeisureRecordController {
    constructor(updateUseCase) {
        this.updateUseCase = updateUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                throw new InvalidError_1.default("ID de registro no válido");
            }
            const { scheduleDate, startTime, endTime, satisfaction, status } = req.body;
            const response = await this.updateUseCase.run(id, {
                scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
                startTime,
                endTime,
                satisfaction,
                status
            });
            return res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({ status: false, message: error.message });
            }
            if (error instanceof NotFoundError_1.NotFoundError) {
                return res.status(404).json({ status: false, message: error.message });
            }
            if (error instanceof DatabaseOperationError_1.DatabaseOperationError) {
                return res.status(500).json({ status: false, message: error.message });
            }
            return res.status(500).json({ status: false, message: "Error en el servicio" });
        }
    }
}
exports.default = UpdateLeisureRecordController;
