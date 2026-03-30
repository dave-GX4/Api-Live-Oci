"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ExternalApiError_1 = __importDefault(require("../../../../core/errors/ExternalApiError"));
class BoredService {
    constructor(env) {
        this.env = env;
    }
    async getRandomActivity() {
        try {
            const response = await axios_1.default.get(`${this.env}/random`);
            return response.data;
        }
        catch (error) {
            throw new ExternalApiError_1.default("Bored-API", error.message);
        }
    }
    async getFilterActivities(type, participants) {
        try {
            const params = new URLSearchParams();
            if (type)
                params.append('type', type);
            if (participants)
                params.append('participants', participants.toString());
            const response = await axios_1.default.get(`${this.env}/filter?${params.toString()}`);
            return Array.isArray(response.data) ? response.data : [response.data];
        }
        catch (error) {
            throw new ExternalApiError_1.default("Bored-API", error.message);
        }
    }
    async getActivityByKey(key) {
        try {
            const response = await axios_1.default.get(`${this.env}/activity/${key}`);
            return response.data;
        }
        catch (error) {
            throw new ExternalApiError_1.default("Bored-API", error.message);
        }
    }
}
exports.default = BoredService;
