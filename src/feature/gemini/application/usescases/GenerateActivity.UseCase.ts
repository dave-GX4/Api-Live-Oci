import ActivitiesRepository from "../../../activity/domain/Activities.Repository";
import ActivityResponseDto from "../../../activity/application/dto/ActivityResponseDto";
import IGeminiService from "../externalprovider/IGemini.Service";
import LeisureRecordRepository from "../../../leisurerecord/domain/LeisureRecord.Repository";
import UuidService from "../../../../core/services/implements/Uuid.Service";
import UUID from "../../../../core/valueobjects/UUID";
import Activity from "../../../activity/domain/entity/Activity";
import LeisureRecord from "../../../leisurerecord/domain/entitie/LeisureRecord";
import ActivityInputData from "../dtos/ActivityInputData";
import UserRepository from "../../../user/domain/User.Repository";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import DataInputDto from "../dtos/DataInputDto";

export default class GenerateActivityUseCase {
    constructor(
        private readonly activityRepository: ActivitiesRepository,
        private readonly leisureRepository: LeisureRecordRepository,
        private readonly userRepository: UserRepository,
        private readonly externalGemini: IGeminiService,
        private readonly serviceUuid: UuidService
    ) {}

    async run(
        userIdStr: string, 
        inputData: ActivityInputData
    ): Promise<ActivityResponseDto> {
        const user = await this.userRepository.getByIdUser(userIdStr)
        if(!user){
            throw new NotFoundError("No se encontro la informacion del usuario")
        }

        const data: DataInputDto ={
            name: user.name,
            interests: user.interests,
            topics: user.topics,
            description: user.description,
            leisureType: user.leisureType,
            activityTemplate: inputData.activity,
            typeTemplate: inputData.type,
            participantsTemplate: inputData.participants,
            durationTemplate: inputData.duration,
            kidFriendlyTemplate: inputData.kidFriendly
        }

        const aiResponse = await this.externalGemini.generateCustomActivity(data);

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