"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GetAllLeisureRecordByUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(id) {
        const idUser = UUID_1.default.validate(id);
        const results = await this.repository.getAllByUser(idUser.getValue());
        return results.map(result => ({
            uuid: result.uuid.getValue(),
            scheduleDate: result.scheduleDate,
            startTime: result.startTime,
            endTime: result.endTime,
            durationMinutes: result.durationMinutes,
            satisfaction: result.satisfaction,
            status: result.status
        }));
    }
}
exports.default = GetAllLeisureRecordByUserUseCase;
