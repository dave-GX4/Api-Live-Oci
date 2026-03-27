"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class AddScheduleUsesCase {
    constructor(repository, serviceUuid) {
        this.repository = repository;
        this.serviceUuid = serviceUuid;
    }
    async run(idUser, title, days, startTime, endTime, active, type) {
        let TypeSchedule;
        (function (TypeSchedule) {
            TypeSchedule["WORK"] = "trabajo";
            TypeSchedule["CUSTOM"] = "personalizado";
        })(TypeSchedule || (TypeSchedule = {}));
        if (!idUser?.trim()) {
            throw new InvalidError_1.default("El ID de usuario es requerido");
        }
        if (!title?.trim()) {
            throw new InvalidError_1.default("El título es requerido");
        }
        if (!startTime?.trim()) {
            throw new InvalidError_1.default("La hora de inicio es requerida");
        }
        if (!endTime?.trim()) {
            throw new InvalidError_1.default("La hora de fin es requerida");
        }
        if (active === undefined) {
            throw new InvalidError_1.default("El estado activo es requerido");
        }
        if (!type?.trim()) {
            throw new InvalidError_1.default("El tipo es requerido");
        }
        if (!days || days.length === 0) {
            throw new InvalidError_1.default("Debe seleccionar al menos un día");
        }
        const validDays = days.every(d => Number.isInteger(d) && d >= 0 && d <= 6);
        if (!validDays) {
            throw new InvalidError_1.default("Los días deben ser números del 0 (domingo) al 6 (sábado)");
        }
        const validTypes = Object.values(TypeSchedule);
        if (!validTypes.includes(type)) {
            throw new InvalidError_1.default(`El tipo debe ser uno de: ${validTypes.join(', ')}`);
        }
        const userId = UUID_1.default.validate(idUser);
        const uuid = await this.serviceUuid.generate();
        const newid = UUID_1.default.validate(uuid);
        if (type === TypeSchedule.WORK) {
            const existingSchedules = await this.repository.getAllSchedulesByUser(userId.getValue());
            const hasWorkSchedule = existingSchedules.some(schedule => schedule.type === TypeSchedule.WORK);
            if (hasWorkSchedule) {
                throw new InvalidError_1.default("El usuario ya tiene un horario de trabajo registrado");
            }
        }
        const newSchedule = {
            uuid: newid,
            uuidUser: userId,
            title: title.trim(),
            days: days,
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            active: active,
            type: type
        };
        await this.repository.addSchedule(newSchedule);
        return {
            message: "El horario se creó con éxito",
            status: 201,
        };
    }
}
exports.default = AddScheduleUsesCase;
