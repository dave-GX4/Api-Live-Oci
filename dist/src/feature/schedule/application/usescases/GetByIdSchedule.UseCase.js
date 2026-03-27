"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GetByIdScheduleUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id) {
        const idValue = UUID_1.default.validate(id);
        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if (!schedule) {
            throw new NotFoundError_1.NotFoundError("Horario", id, "UUID");
        }
        const response = {
            uuid: schedule.uuid.getValue(),
            title: schedule.title,
            days: schedule.days,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            active: schedule.active,
            type: schedule.type
        };
        return response;
    }
}
exports.default = GetByIdScheduleUseCase;
