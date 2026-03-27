"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class DeleteScheduleUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id) {
        const idValue = UUID_1.default.validate(id);
        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if (!schedule) {
            throw new InvalidError_1.default("No se encontro ningun horario");
        }
        if (id !== schedule.uuid.getValue()) {
            throw new InvalidError_1.default("El horario no corresponde");
        }
        await this.repository.deleteSchedule(schedule.uuid.getValue());
        return {
            message: "Se ha eliminado corectamente",
            status: 200
        };
    }
}
exports.default = DeleteScheduleUseCase;
