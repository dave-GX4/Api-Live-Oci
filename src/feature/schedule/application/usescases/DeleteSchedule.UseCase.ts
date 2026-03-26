import InvalidError from "../../../../core/errors/InvalidError";
import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import ScheduleResponseDto from "../dto/ScheduleResponseDto";

export default class DeleteScheduleUseCase{
    constructor(
        private readonly repository : ScheduleRepository
    ){}

    async run(id: string): Promise<ScheduleResponseDto>{
        const idValue = UUID.validate(id);

        const schedule = await this.repository.getByIdSchedule(idValue.getValue());

        if(!schedule){
            throw new InvalidError("No se encontro ningun horario");
        }

        if(id !== schedule.uuid.getValue()){
            throw new InvalidError("El horario no corresponde");
        }

        await this.repository.deleteSchedule(schedule.uuid.getValue());
        
        return {
            message: "Se ha eliminado corectamente",
            status: 200
        }
    }
}