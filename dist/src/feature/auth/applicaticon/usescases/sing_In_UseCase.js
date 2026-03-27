"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class SingInUseCase {
    constructor(repository, serviceEncrypt) {
        this.repository = repository;
        this.serviceEncrypt = serviceEncrypt;
    }
    async run(email, password) {
        const user = await this.repository.findUserByEmail(email);
        if (!user) {
            throw new NotFoundError_1.NotFoundError('Usuario', email, 'email');
        }
        const isPasswordValid = await this.serviceEncrypt.compare(password, user.password.getValue());
        if (!isPasswordValid) {
            throw new InvalidError_1.default('Contraseña invalida');
        }
        return {
            data: user.uuid.getValue(),
            message: "Se a verificado correctamente",
            status: true
        };
    }
}
exports.default = SingInUseCase;
