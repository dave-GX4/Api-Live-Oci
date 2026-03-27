"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExistsError = void 0;
class ExistsError extends Error {
    constructor(email) {
        super(`El usuario con email ${email} ya está registrado.`);
        this.name = 'UserAlreadyExistsError';
    }
}
exports.ExistsError = ExistsError;
