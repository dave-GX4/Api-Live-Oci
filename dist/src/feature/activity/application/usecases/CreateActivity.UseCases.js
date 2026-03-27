"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class CreateActivityUseCase {
    constructor(repository, leisureRepository, serviceUuid) {
        this.repository = repository;
        this.leisureRepository = leisureRepository;
        this.serviceUuid = serviceUuid;
    }
    async run(uuidUser, name, description, type, category, durationMinutes, socialType) {
        if (!uuidUser || uuidUser.trim() === '') {
            throw new InvalidError_1.default("El ID de usuario es requerido");
        }
        const isEmpty = (value) => value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
        if (isEmpty(name)) {
            throw new InvalidError_1.default("El nombre es requerido");
        }
        if (isEmpty(description)) {
            throw new InvalidError_1.default("La descripción es requerida");
        }
        if (isEmpty(type)) {
            throw new InvalidError_1.default("El tipo es requerido");
        }
        if (isEmpty(category)) {
            throw new InvalidError_1.default("La categoría es requerida");
        }
        if (isEmpty(socialType)) {
            throw new InvalidError_1.default("El tipo social es requerido");
        }
        const duration = typeof durationMinutes === 'string'
            ? Number.parseInt(durationMinutes, 10)
            : durationMinutes;
        if (Number.isNaN(duration) || duration <= 0) {
            throw new InvalidError_1.default("La duración debe ser un número positivo en minutos");
        }
        const userId = UUID_1.default.validate(uuidUser);
        const newId = await this.serviceUuid.generate();
        const activityId = UUID_1.default.validate(newId);
        const activity = {
            uuid: activityId,
            uuidUser: userId,
            name: name.trim(),
            description: description.trim(),
            type: type.trim(),
            category: category.trim(),
            durationMinutes: duration,
            socialType: socialType.trim()
        };
        await this.repository.createActivity(activity);
        const leisureId = await this.serviceUuid.generate();
        const leisureUUID = UUID_1.default.validate(leisureId);
        const leisureRecord = {
            uuid: leisureUUID,
            uuidUser: userId,
            uuidActivity: activityId,
            scheduleDate: undefined,
            startTime: '00:00',
            endTime: '00:00',
            durationMinutes: 0,
            satisfaction: 0,
            status: 'creado'
        };
        await this.leisureRepository.addActivity(leisureRecord);
        return {
            data: {
                id: userId.getValue(),
                idActivity: activityId.getValue(),
                idLR: leisureUUID.getValue()
            },
            message: "Actividad y registro de ocio creados correctamente",
            status: 201
        };
    }
}
exports.default = CreateActivityUseCase;
