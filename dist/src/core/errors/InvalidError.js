"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidError';
    }
}
exports.default = InvalidError;
