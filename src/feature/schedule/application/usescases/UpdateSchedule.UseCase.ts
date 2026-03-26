import InvalidError from "../../../../core/errors/InvalidError";
import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import ScheduleResponseDto from "../dto/ScheduleResponseDto";

export default class UpdateScheduleUseCase{
    constructor(
        private readonly repository : ScheduleRepository
    ){}

    async run(
        id: string, 
        title: string,
        days: number[],
        start_time: string,
        end_time: string,
        active: boolean
    ): Promise<ScheduleResponseDto>{
        const idValue = UUID.validate(id);

        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if(!schedule){
            throw new InvalidError("No se pudo verificar");
        }

        const updates: any = {};
        
        if(title) updates.title = title;
        if (days !== undefined) updates.days = days;
        if(start_time) updates.start_time = start_time;
        if(end_time) updates.end_time = end_time;
        if (active !== undefined) updates.active = active;

        await this.repository.updatenSchedule(schedule.id.getValue(), updates);

        return{
            message: "Se a actualizado correctamente el horario",
            status: 200
        }
    }
}