"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(resource, // ej: "Usuario", "Producto", "Post"
    identifier, // ej: "anton@gsywe.com", "ID 123"
    field = 'id' // ej: "email", "UUID", "slug"
    ) {
        const msg = identifier
            ? `No se encontró ${resource.toLowerCase()} con ${field}: ${identifier}`
            : `${resource} no encontrado`;
        super(msg);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
