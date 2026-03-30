"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const ConfigurationError_1 = __importDefault(require("../errors/ConfigurationError"));
dotenv_1.default.config();
const getEnv = (key) => {
    const value = process.env[key];
    if (!value) {
        throw new ConfigurationError_1.default(key);
    }
    return value;
};
exports.env = {
    server: {
        port: Number(process.env.SERVER_PORT) || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    database: {
        host: getEnv('DB_HOST'),
        user: getEnv('DB_USER'),
        pass: getEnv('DB_PASSWORD'),
        name: getEnv('DB_NAME'),
        port: Number(process.env.DB_PORT) || 3306
    },
    externalApis: {
        gemini: getEnv('API_SERVER_GEMINI'),
        bored: getEnv('API_SERVER_BORED')
    }
};
