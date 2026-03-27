"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class UpdateScheduleUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id, title, days, startTime, endTime, active) {
        const idValue = UUID_1.default.validate(id);
        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if (!schedule) {
            throw new NotFoundError_1.NotFoundError("Horario", id, "UUID");
        }
        const updates = {};
        if (title !== undefined)
            updates.title = title.trim();
        if (days !== undefined) {
            const validDays = days.every(d => Number.isInteger(d) && d >= 0 && d <= 6);
            if (!validDays) {
                throw new InvalidError_1.default("Los días deben ser números del 0 al 6");
            }
            updates.days = days;
        }
        if (startTime !== undefined) {
            if (!this.isValidTimeFormat(startTime)) {
                throw new InvalidError_1.default("Formato de hora inicio inválido (use HH:MM)");
            }
            updates.startTime = startTime;
        }
        if (endTime !== undefined) {
            if (!this.isValidTimeFormat(endTime)) {
                throw new InvalidError_1.default("Formato de hora fin inválido (use HH:MM)");
            }
            updates.endTime = endTime;
        }
        if (active !== undefined)
            updates.active = active;
        if (Object.keys(updates).length === 0) {
            return {
                message: "No se proporcionaron cambios",
                status: 200
            };
        }
        await this.repository.updatenSchedule(idValue.getValue(), updates);
        return {
            message: "Se actualizó correctamente el horario",
            status: 200
        };
    }
    isValidTimeFormat(time) {
        return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
    }
}
exports.default = UpdateScheduleUseCase;
