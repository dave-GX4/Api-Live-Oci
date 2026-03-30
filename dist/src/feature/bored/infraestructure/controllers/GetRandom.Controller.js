"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
class GetRandomController {
    constructor(useCase) {
        this.useCase = useCase;
    }
    async run(req, res) {
        try {
            const response = await this.useCase.run();
            return res.status(200).json(response);
        }
        catch (error) {
            const status = error instanceof ExternalApiError_1.default ? 502 : 400;
            return res.status(status).json({ message: error.message, status });
        }
    }
}
exports.default = GetRandomController;
