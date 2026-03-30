"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConfigurationError extends Error {
    constructor(variableName) {
        super(`[FATAL] La variable de entorno ${variableName} no está definida o es inválida.`);
        this.name = "ConfigurationError";
    }
}
exports.default = ConfigurationError;
