"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const ExistsError_1 = require("../../../../core/errors/ExistsError");
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class SingInController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    async run(req, res) {
        try {
            const body = req.body;
            const result = await this.useCase.run(body.email, body.password);
            return res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof NotFoundError_1.NotFoundError) {
                return res.status(404).json({
                    status: false,
                    message: error.message
                });
            }
            if (error instanceof InvalidError_1.default) {
                return res.status(401).json({
                    status: false,
                    message: error.message
                });
            }
            if (error instanceof ExistsError_1.ExistsError) {
                return res.status(402).json({
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
exports.default = SingInController;
