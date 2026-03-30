"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
class GetFilterActivityController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    async run(req, res) {
        try {
            const type = req.query.type;
            const participantsRaw = req.query.participants;
            if (!type && !participantsRaw) {
                throw new InvalidError_1.default("Se requiere al menos un parámetro de filtro (type o participants).");
            }
            const participants = participantsRaw ? Number.parseInt(participantsRaw, 10) : undefined;
            if (participants !== undefined && (Number.isNaN(participants) || participants <= 0)) {
                throw new InvalidError_1.default("El número de participantes debe ser un entero positivo.");
            }
            const response = await this.useCase.run(type, participants || 0);
            return res.status(200).json(response);
        }
        catch (error) {
            const status = error instanceof ExternalApiError_1.default ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}
exports.default = GetFilterActivityController;
