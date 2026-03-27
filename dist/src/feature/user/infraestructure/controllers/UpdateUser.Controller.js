"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class UpdateUserController {
    constructor(updateUseCase) {
        this.updateUseCase = updateUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError_1.default("No se encontró ningún identificador");
            }
            const { email, password, notifications, interests, topics, description, leisureType } = req.body;
            if (interests !== undefined && !Array.isArray(interests)) {
                throw new InvalidError_1.default("interests debe ser un array");
            }
            if (topics !== undefined && !Array.isArray(topics)) {
                throw new InvalidError_1.default("topics debe ser un array");
            }
            const response = await this.updateUseCase.run(id, leisureType, email, password, notifications, interests, topics, description);
            return res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({ message: "Error de validacion: " + error.message });
            }
            if (error instanceof NotFoundError_1.NotFoundError) {
                return res.status(409).json({ message: error.message });
            }
            if (error instanceof DatabaseOperationError_1.DatabaseOperationError) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Error en el servicio :< Intente más tarde o de nuevo." });
        }
    }
}
exports.default = UpdateUserController;
