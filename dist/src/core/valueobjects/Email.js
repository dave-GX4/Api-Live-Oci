"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../errors/InvalidError"));
class Email {
    constructor(value) {
        this.value = value;
    }
    static validated(value) {
        const trimmedValue = value.trim().toLowerCase();
        if (!this.isValidFormat(trimmedValue)) {
            throw new InvalidError_1.default('El formato del email no es válido.');
        }
        if (!this.isDomainAllowed(trimmedValue)) {
            throw new InvalidError_1.default(`El dominio del email no está permitido. Solo se aceptan: ${this.ALLOWED_DOMAINS.join(', ')}`);
        }
        return new Email(trimmedValue);
    }
    static isValidFormat(value) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(value);
    }
    static isDomainAllowed(value) {
        const domain = value.split('@')[1];
        return this.ALLOWED_DOMAINS.includes(domain);
    }
    static fromDatabase(value) {
        return new Email(value);
    }
    getValue() {
        return this.value;
    }
}
Email.ALLOWED_DOMAINS = [
    'gmail.com',
    'outlook.com',
];
exports.default = Email;
