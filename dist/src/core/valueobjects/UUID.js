"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../errors/InvalidError"));
class UUID {
    constructor(value) {
        this.value = value;
    }
    static validate(value) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!regex.test(value)) {
            throw new InvalidError_1.default('El uuid no es valido');
        }
        return new UUID(value);
    }
    static fromDatabase(value) {
        return new UUID(value);
    }
    getValue() {
        return this.value;
    }
}
exports.default = UUID;
