import ActivitiesRepository from "../../../activity/domain/Activities.Repository";
import ActivityResponseDto from "../../../activity/application/dto/ActivityResponseDto";
import IGeminiService from "../externalprovider/IGemini.Service";
import LeisureRecordRepository from "../../../leisurerecord/domain/LeisureRecord.Repository";
import UuidService from "../../../../core/services/implements/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import Activity from "../../../activity/domain/entitie/Activity";
import LeisureRecord from "../../../leisurerecord/domain/entitie/LeisureRecord";
import ActivityInputData from "../dtos/ActivityInputData";

export default class GenerateActivityUseCase {
    constructor(
        private readonly activityRepository: ActivitiesRepository,
        private readonly leisureRepository: LeisureRecordRepository,
        private readonly externalGemini: IGeminiService,
        private readonly serviceUuid: UuidService
    ) {}

    async run(
        userIdStr: string, 
        inputData: ActivityInputData
    ): Promise<ActivityResponseDto> {
        const aiResponse = await this.externalGemini.generateCustomActivity(inputData);

        const userId = UUID.validate(userIdStr);
        const activityId = UUID.validate(await this.serviceUuid.generate());
        const leisureId = UUID.validate(await this.serviceUuid.generate());

        console.log(aiResponse)

        const activity: Activity = {
            uuid: activityId,
            uuidUser: userId,
            name: aiResponse.titulo.trim(),
            description: aiResponse.descripcion.trim(),
            type: aiResponse.type,
            category: aiResponse.categoria.trim(),
            durationMinutes: aiResponse.duracionEstimada,
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
            message: "Actividad generada por IA guardada correctamente",
            status: 201
        };
    }
}