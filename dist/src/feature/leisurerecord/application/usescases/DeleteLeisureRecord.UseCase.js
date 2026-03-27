"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class DeleteLeisureRecordUseCase {
    constructor(leisureRepository, activityRepository) {
        this.leisureRepository = leisureRepository;
        this.activityRepository = activityRepository;
    }
    async run(uuidLeisureRecord) {
        const leisureId = UUID_1.default.validate(uuidLeisureRecord);
        const leisureRecord = await this.leisureRepository.getById(leisureId.getValue());
        if (!leisureRecord) {
            throw new NotFoundError_1.NotFoundError("Registro de ocio", uuidLeisureRecord, "UUID");
        }
        const activity = await this.activityRepository.getByIdActivity(leisureRecord.uuidActivity.getValue());
        if (!activity) {
            throw new NotFoundError_1.NotFoundError("Actividad", leisureRecord.uuidActivity.getValue(), "UUID");
        }
        await this.leisureRepository.deleteActivityComplete(leisureId.getValue());
        await this.activityRepository.deleteActivity(activity.uuid.getValue());
        return {
            message: "Actividad y registro de ocio eliminados correctamente",
            status: 200
        };
    }
}
exports.default = DeleteLeisureRecordUseCase;
