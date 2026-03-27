"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
class CreateActivityController {
    constructor(createUseCase) {
        this.createUseCase = createUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError_1.default("No se encontró ningún identificador de usuario");
            }
            const { name, description, type, category, durationMinutes, socialType } = req.body;
            const response = await this.createUseCase.run(id, name, description, type, category, durationMinutes, socialType);
            return res.status(201).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({
                    status: false,
                    message: "Error de validación: " + error.message
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
exports.default = CreateActivityController;
