"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class DeleteActivityUseCase {
    constructor(respository) {
        this.respository = respository;
    }
    async run(id) {
        const idValue = UUID_1.default.validate(id);
        const activity = await this.respository.getByIdActivity(idValue.getValue());
        if (!activity) {
            throw new NotFoundError_1.NotFoundError("No existe la actividad");
        }
        if (id !== activity.uuid.getValue()) {
            throw new InvalidError_1.default("Error en la actividad");
        }
        await this.respository.deleteActivity(idValue.getValue());
        return {
            message: "Se elimino la actividad correctamente",
            status: 200
        };
    }
}
exports.default = DeleteActivityUseCase;
