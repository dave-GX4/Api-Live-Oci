import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import GetScheduleResponseDto from "../dto/GetScheduleResponseDto";

export default class GetAllScheduleByUserUseCase{
    constructor(
        private readonly repository: ScheduleRepository
    ){}

    async run(idUser: string): Promise<GetScheduleResponseDto[]>{
        const userId = UUID.validate(idUser);

        const results = await this.repository.getAllSchedulesByUser(userId.getValue());

        return results.map(result => ({
            uuid: result.uuid.getValue(),
            title: result.title,
            days: result.days,
            startTime: result.startTime,
            endTime: result.endTime,
            active: result.active,
            type: result.type
        }));
    }
}