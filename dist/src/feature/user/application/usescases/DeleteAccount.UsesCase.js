"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class DeleteAccountUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id) {
        const idValue = UUID_1.default.validate(id);
        const result = await this.repository.getByIdUser(idValue.getValue());
        if (!result) {
            throw new NotFoundError_1.NotFoundError("No se pudo encontrar nadie: El usuario no existe");
        }
        if (id != result.uuid.getValue()) {
            throw new InvalidError_1.default("No tienes acturizacion para esta cuenta");
        }
        await this.repository.deleteAccount(result.uuid.getValue());
        return {
            message: "Se a eliminado la cuenta correctamente te extrañaremos :>",
            status: 200
        };
    }
}
exports.default = DeleteAccountUseCase;
