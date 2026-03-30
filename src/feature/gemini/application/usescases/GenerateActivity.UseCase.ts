import ActivitiesRepository from "../../../activity/domain/Activities.Repository";
import ActivityResponseDto from "../../../activity/application/dto/ActivityResponseDto";
import IGeminiService from "../externalprovider/IGemini.Service";
import LeisureRecordRepository from "../../../leisurerecord/domain/LeisureRecord.Repository";
import UuidService from "../../../../core/services/implements/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import Activity from "../../../activity/domain/entitie/Activity";
import LeisureRecord from "../../../leisurerecord/domain/entitie/LeisureRecord";

export default class GenerateActivityUseCase {
    constructor(
        private readonly activityRepository: ActivitiesRepository,
        private readonly leisureRepository: LeisureRecordRepository,
        private readonly externalGemini: IGeminiService,
        private readonly serviceUuid: UuidService
    ) {}

    async run(userIdStr: string, inputData: any): Promise<ActivityResponseDto> {

        const aiResponse = await this.externalGemini.generateCustomActivity(inputData);
        console.log(aiResponse)

        const userId = UUID.validate(userIdStr);
        const activityId = UUID.validate(await this.serviceUuid.generate());
        const leisureId = UUID.validate(await this.serviceUuid.generate());

        const activity: Activity = {
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

        const leisureRecord: LeisureRecord = {
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

    private convertToMinutes(durationStr: string): number {
        const value = Number.parseInt(durationStr.match(/\d+/)?.[0] || "0", 10);
        const text = durationStr.toLowerCase();
        return (text.includes("hour") || text.includes("hora")) ? value * 60 : value;
    }
}