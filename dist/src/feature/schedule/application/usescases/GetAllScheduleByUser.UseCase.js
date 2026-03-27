"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GetAllScheduleByUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(idUser) {
        const userId = UUID_1.default.validate(idUser);
        const results = await this.repository.getAllSchedulesByUser(userId.getValue());
        return results.map(result => ({
            uuid: result.uuid.getValue(),
            title: result.title,
            days: result.days,
            startTime: result.startTime,
            endTime: result.endTime,
            active: result.active,
            type: result.type
        }));
    }
}
exports.default = GetAllScheduleByUserUseCase;
