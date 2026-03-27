"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseOperationError = void 0;
class DatabaseOperationError extends Error {
    constructor(originalError) {
        super('Error inesperado en la base de datos.');
        this.name = 'DatabaseOperationError';
        console.error(originalError);
    }
}
exports.DatabaseOperationError = DatabaseOperationError;
