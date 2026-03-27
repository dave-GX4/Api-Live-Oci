"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class UpdateScheduleController {
    constructor(updateUseCase) {
        this.updateUseCase = updateUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError_1.default("No se encontró identificador del horario");
            }
            const { title, days, startTime, endTime, active } = req.body;
            const activeBool = active === 1 || active === '1' || active === true;
            if (days !== undefined && !Array.isArray(days)) {
                throw new InvalidError_1.default("days debe ser un array de números");
            }
            const response = await this.updateUseCase.run(id, title, days, startTime, endTime, activeBool);
            return res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validación: " + error.message
                });
            }
            if (error instanceof NotFoundError_1.NotFoundError) {
                return res.status(404).json({
                    status: false,
                    message: error.message
                });
            }
            if (error instanceof DatabaseOperationError_1.DatabaseOperationError) {
                return res.status(500).json({
                    status: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                status: false,
                message: "Error en el servicio. Intente más tarde."
            });
        }
    }
}
exports.default = UpdateScheduleController;
