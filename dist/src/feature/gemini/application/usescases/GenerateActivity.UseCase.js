"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
class GenerateActivityUseCase {
    constructor(activityRepository, leisureRepository, externalGemini, serviceUuid) {
        this.activityRepository = activityRepository;
        this.leisureRepository = leisureRepository;
        this.externalGemini = externalGemini;
        this.serviceUuid = serviceUuid;
    }
    async run(userIdStr, inputData) {
        const aiResponse = await this.externalGemini.generateCustomActivity(inputData);
        console.log(aiResponse);
        const userId = UUID_1.default.validate(userIdStr);
        const activityId = UUID_1.default.validate(await this.serviceUuid.generate());
        const leisureId = UUID_1.default.validate(await this.serviceUuid.generate());
        const activity = {
            uuid: activityId,
            uuidUser: userId,
            name: aiResponse.titulo.trim(),
            description: aiResponse.descripcion.trim(),
            type: inputData.type_template || "generado",
            category: aiResponse.categoria.trim(),
            durationMinutes: this.convertToMinutes(aiResponse.duracion_estimada),
            socialType: aiResponse.socialType.trim()
        };
        await this.activityRepository.createActivity(activity);
        const leisureRecord = {
            uuid: leisureId,
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
                idLR: leisureId.getValue(),
            },
            message: "Actividad generada por IA guardada correctamente",
            status: 201
        };
    }
    convertToMinutes(durationStr) {
        const value = Number.parseInt(new RegExp(/\d+/).exec(durationStr)?.[0] || "0", 10);
        const text = durationStr.toLowerCase();
        return (text.includes("hour") || text.includes("hora")) ? value * 60 : value;
    }
}
exports.default = GenerateActivityUseCase;
