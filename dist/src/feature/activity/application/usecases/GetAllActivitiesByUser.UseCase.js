"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GetAllActivitiesByUserUseCase {
    constructor(repository) {
        this.repository = repository;
    }
    async run(idUser) {
        const userId = UUID_1.default.validate(idUser);
        const results = await this.repository.getAllActivitiesByUser(userId.getValue());
        return results.map(result => ({
            uuid: result.uuid.getValue(),
            name: result.name,
            description: result.description,
            type: result.type,
            category: result.category,
            durationMinutes: result.durationMinutes,
            socialType: result.socialType
        }));
    }
}
exports.default = GetAllActivitiesByUserUseCase;
