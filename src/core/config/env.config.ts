console.log('>>> TODAS LAS VARIABLES DISPONIBLES:', Object.keys(process.env).sort());
console.log('>>> VARIABLES QUE EMPIEZAN CON DB:', Object.keys(process.env).filter(k => k.startsWith('DB')));
console.log('>>> RAILWAY_* VARIABLES:', Object.keys(process.env).filter(k => k.startsWith('RAILWAY')));

import dotenv from "dotenv";
import ConfigurationError from "../errors/ConfigurationError";
import path from "node:path";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const getEnv = (key: string): string => {
    const value = process.env[key];
    if (!value || value.trim() === '') {
        throw new ConfigurationError(`[FATAL] La variable de entorno ${key} no está definida o es inválida. Valor actual: ${value}`);
    }
    return value;
};

console.log('[ENV DEBUG] NODE_ENV:', process.env.NODE_ENV);
console.log('[ENV DEBUG] Variables disponibles:', Object.keys(process.env).filter(k => k.includes('DB')));

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