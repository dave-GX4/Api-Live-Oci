"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
class GenerateActivityController {
    constructor(usecase) {
        this.usecase = usecase;
    }
    async run(req, res) {
        try {
            const { id } = req.params;
            const inputData = req.body;
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new InvalidError_1.default("No se encontró ningún identificador de usuario");
            }
            const response = await this.usecase.run(id, inputData);
            return res.status(201).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({
                    message: error.message,
                    status: 400
                });
            }
            if (error instanceof NotFoundError_1.NotFoundError) {
                return res.status(404).json({
                    message: error.message,
                    status: 404
                });
            }
            if (error instanceof ExternalApiError_1.default) {
                return res.status(502).json({
                    message: error.message,
                    service: error.serviceName,
                    status: 502
                });
            }
            console.error("Unexpected Error in Controller:", error);
            return res.status(500).json({
                message: "Ocurrió un error inesperado en el servidor",
                status: 500
            });
        }
    }
}
exports.default = GenerateActivityController;
