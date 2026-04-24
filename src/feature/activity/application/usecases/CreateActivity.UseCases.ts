import InvalidError from "../../../../core/errors/InvalidError";
import UuidService from "../../../../core/services/interface/I.Uuid.Service";
import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecord from "../../../leisurerecord/domain/entitie/LeisureRecord";
import LeisureRecordRepository from "../../../leisurerecord/domain/LeisureRecord.Repository";
import ActivitiesRepository from "../../domain/Activities.Repository";
import Activity from "../../domain/entity/Activity";
import ActivityResponseDto from "../dto/ActivityResponseDto";

export default class CreateActivityUseCase{
    constructor(
        private readonly repository : ActivitiesRepository,
        private readonly leisureRepository: LeisureRecordRepository,
        private readonly serviceUuid: UuidService
    ){}

    async run(
        uuidUser: string, 
        name: string, 
        description: string, 
        type: string, 
        category: string, 
        durationMinutes: number | string,
        socialType: string
    ): Promise<ActivityResponseDto> {
        if (!uuidUser || uuidUser.trim() === '') {
            throw new InvalidError("El ID de usuario es requerido");
        }

        const isEmpty = (value: any): boolean => 
            value === null || value === undefined || (typeof value === 'string' && value.trim() === '');
        
        if (isEmpty(name)) {
            throw new InvalidError("El nombre es requerido");
        }
        if (isEmpty(description)) {
            throw new InvalidError("La descripción es requerida");
        }
        if (isEmpty(type)) {
            throw new InvalidError("El tipo es requerido");
        }
        if (isEmpty(category)) {
            throw new InvalidError("La categoría es requerida");
        }
        if (isEmpty(socialType)) {
            throw new InvalidError("El tipo social es requerido");
        }

        const duration = typeof durationMinutes === 'string' 
            ? Number.parseInt(durationMinutes, 10) 
            : durationMinutes;
            
        if (Number.isNaN(duration) || duration <= 0) {
            throw new InvalidError("La duración debe ser un número positivo en minutos");
        }

        const userId = UUID.validate(uuidUser);
        const newId = await this.serviceUuid.generate();
        const activityId = UUID.validate(newId);

        const activity: Activity = {
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
        const leisureUUID = UUID.validate(leisureId);

         const leisureRecord: LeisureRecord = {
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
            message: "Actividad y registro de ocio creados correctamente",
            status: 201
        };
    }
} 