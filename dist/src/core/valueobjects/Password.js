"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../errors/InvalidError"));
class Password {
    constructor(value) {
        this.value = value;
    }
    static validated(value) {
        if (!this.isValid(value)) {
            throw new InvalidError_1.default('La contraseña debe tener al menos una mayúscula, una minúscula y un número.');
        }
        if (value.length < 8)
            throw new InvalidError_1.default('La contraseña debe tener al menos 8 caracteres.');
        return new Password(value);
    }
    static isValid(value) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]+$/;
        return regex.test(value);
    }
    static fromDatabase(value) {
        return new Password(value);
    }
    static convert(value) {
        return new Password(value);
    }
    getValue() {
        return this.value;
    }
}
exports.default = Password;
