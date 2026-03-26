import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import GetScheduleResponseDto from "../dto/GetScheduleResponseDto";

export default class GetByIdScheduleUseCase{
    constructor(
        private readonly repository : ScheduleRepository
    ){}

    async run(id: string): Promise<GetScheduleResponseDto>{
        const idValue = UUID.validate(id);
        
        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if(!schedule){
            throw new NotFoundError("Horario", id, "UUID");
        } 

        const response : GetScheduleResponseDto = {
            uuid: schedule.uuid.getValue(),
            title: schedule.title,
            days: schedule.days,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            active: schedule.active,
            type: schedule.type
        };

        return response;
    }
}