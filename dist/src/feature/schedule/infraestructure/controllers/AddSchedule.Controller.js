"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class AddScheduleController {
    constructor(addUseCase) {
        this.addUseCase = addUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            // ✅ Validación segura del ID
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError_1.default("No se encontró identificador de usuario");
            }
            const { title, day, startTime, endTime, active, type } = req.body;
            const days = Array.isArray(day) ? day : [day].filter(Boolean);
            const activeBool = typeof active === 'string'
                ? active === 'true'
                : Boolean(active);
            const response = await this.addUseCase.run(id, title, days, startTime, endTime, activeBool, type);
            return res.status(201).json(response);
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
exports.default = AddScheduleController;
