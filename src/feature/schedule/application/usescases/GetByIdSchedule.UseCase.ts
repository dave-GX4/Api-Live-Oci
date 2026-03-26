import InvalidError from "../../../../core/errors/InvalidError";
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
            throw new InvalidError("No se encontro el horario");
        } 

        const response : GetScheduleResponseDto = {
            id: schedule.id.getValue(),
            title: schedule.title,
            days: schedule.days,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            active: schedule.active,
            type: schedule.type
        };

        return response;
    }
}