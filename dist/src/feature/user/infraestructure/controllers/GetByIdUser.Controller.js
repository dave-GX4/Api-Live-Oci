"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class GetByIdUserController {
    constructor(getByIdUseCase) {
        this.getByIdUseCase = getByIdUseCase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new InvalidError_1.default("No se encontro ningun identificador");
            }
            const response = await this.getByIdUseCase.run(id);
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
exports.default = GetByIdUserController;
