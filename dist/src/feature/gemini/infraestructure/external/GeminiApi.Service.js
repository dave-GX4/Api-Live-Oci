"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
class GeminiService {
    constructor(evn) {
        this.evn = evn;
    }
    async generateCustomActivity(promptData) {
        try {
            const response = await axios_1.default.post(`${this.evn}/activity/generate`, promptData);
            return response.data;
        }
        catch (error) {
            throw new ExternalApiError_1.default("Gemini-Python-Service", error.response?.data?.message || error.message);
        }
    }
}
exports.default = GeminiService;
