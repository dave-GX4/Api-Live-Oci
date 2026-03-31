import dotenv from "dotenv";
import ConfigurationError from "../errors/ConfigurationError";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new ConfigurationError(key);
    }
    return value;
};

export const env = {
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
} as const;