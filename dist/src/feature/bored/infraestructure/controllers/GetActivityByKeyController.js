"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
class GetActivityByKeyController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    async run(req, res) {
        try {
            const { key } = req.params;
            if (!key || Number.isNaN(Number(key))) {
                throw new InvalidError_1.default("La llave de actividad debe ser un formato numérico válido.");
            }
            const response = await this.useCase.run(Number(key));
            return res.status(200).json(response);
        }
        catch (error) {
            if (error instanceof InvalidError_1.default) {
                return res.status(400).json({ message: "Error de validacion: " + error.message });
            }
            const status = error instanceof ExternalApiError_1.default ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}
exports.default = GetActivityByKeyController;
