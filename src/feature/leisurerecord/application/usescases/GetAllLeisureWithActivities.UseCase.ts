import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import { LeisureWithActivityDto } from "../dto/LeisureWithActivityDto";

export default class GetAllLeisureWithActivitiesUseCase {
    constructor(
        private readonly leisureRepository: LeisureRecordRepository
    ) {}

    async run(id: string): Promise<LeisureWithActivityDto[]> {
        const idUser = UUID.validate(id);
        
        const rawResults = await this.leisureRepository.getAllWithActivityByUser(idUser.getValue());

        return rawResults.map(row => ({
            leisureUuid: row.leisureUuid.getValue(), 
            scheduleDate: row.scheduleDate ?? undefined, 
            startTime: row.startTime,
            endTime: row.endTime,
            durationMinutes: row.durationMinutes,
            satisfaction: row.satisfaction,
            status: row.status,
            activityUuid: row.activityUuid.getValue(),
            activityName: row.activityName,
            activityDescription: row.activityDescription,
            activityType: row.activityType,
            activityCategory: row.activityCategory,
            activityEstimatedDuration: row.activityEstimatedDuration,
            socialType: row.socialType
        }));
    }
}