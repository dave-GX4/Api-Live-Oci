"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const ExistsError_1 = require("../../../../core/errors/ExistsError");
class SingUpController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    async run(req, res) {
        try {
            const body = req.body;
            const result = await this.useCase.run(body);
            return res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof ExistsError_1.ExistsError) {
                return res.status(400).json({
                    status: false,
                    message: error.message
                });
            }
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({
                    status: false,
                    message: error.message
                });
            }
            return res.status(500).json({
                status: false,
                message: "Error interno inesperado en el servidor",
                details: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}
exports.default = SingUpController;
