import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import GetScheduleResponseDto from "../dto/GetScheduleResponseDto";

export default class GetAllScheduleByUserUseCase{
    constructor(
        private readonly repository: ScheduleRepository
    ){}

    async run(id_user: string): Promise<GetScheduleResponseDto[]>{
        const userId = UUID.validate(id_user);

        const results = await this.repository.getAllSchedulesByUser(userId.getValue());

        return results.map(result => ({
            id: result.id.getValue(),
            title: result.title,
            days: result.days,
            start_time: result.start_time,
            end_time: result.end_time,
            active: result.active,
            type: result.type
        }));
    }
}