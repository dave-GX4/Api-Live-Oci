"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class UpdateLeisureRecordUseCase {
    constructor(leisureRepository) {
        this.leisureRepository = leisureRepository;
    }
    async run(uuidLeisureRecord, updates) {
        const recordId = UUID_1.default.validate(uuidLeisureRecord);
        const record = await this.leisureRepository.getById(recordId.getValue());
        if (!record) {
            throw new NotFoundError_1.NotFoundError("Registro de ocio", uuidLeisureRecord, "UUID");
        }
        let duration = record.durationMinutes;
        if (updates.startTime && updates.endTime) {
            duration = this.calculateDuration(updates.startTime, updates.endTime);
        }
        const updateData = {};
        if (updates.scheduleDate !== undefined)
            updateData.scheduleDate = updates.scheduleDate;
        if (updates.startTime !== undefined)
            updateData.startTime = updates.startTime;
        if (updates.endTime !== undefined)
            updateData.endTime = updates.endTime;
        if (updates.satisfaction !== undefined)
            updateData.satisfaction = updates.satisfaction;
        if (updates.status !== undefined)
            updateData.status = updates.status;
        if (updates.startTime && updates.endTime) {
            updateData.durationMinutes = duration;
        }
        await this.leisureRepository.updateLeisureRecord(recordId.getValue(), updateData);
        return {
            message: "Registro de ocio actualizado correctamente",
            status: 200
        };
    }
    calculateDuration(start, end) {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return (endH * 60 + endM) - (startH * 60 + startM);
    }
}
exports.default = UpdateLeisureRecordUseCase;
