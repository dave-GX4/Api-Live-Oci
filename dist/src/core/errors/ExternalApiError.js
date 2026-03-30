"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ExternalApiError extends Error {
    constructor(serviceName, details) {
        super(`Error en el servicio externo [${serviceName}]: ${details}`);
        this.serviceName = serviceName;
        this.details = details;
        this.name = "ExternalApiError";
    }
}
exports.default = ExternalApiError;
