import InvalidError from "../../../../core/errors/InvalidError";
import UuidService from "../../../../core/services/interface/uuidService";
import UUID from "../../../../core/valueobjects/UUID";
import Schedule from "../../domain/entitie/Schedule";
import ScheduleRepository from "../../domain/Schedule.Repository";
import ScheduleResponseDto from "../dto/ScheduleResponseDto";

export default class AddScheduleUsesCase{
    constructor(
        private readonly repository : ScheduleRepository,
        private readonly serviceUuid: UuidService
    ){}

    async run(
        id_user: string,
        title: string,
        days: number[],
        start_time: string,
        end_time: string,
        active: boolean,
        type: string
    ):Promise<ScheduleResponseDto>{

        enum TypeSchedule {
            WORK = "trabajo",
            CUSTOM = "personalizado"
        }

        if (!id_user || !title || !start_time || !end_time || active === undefined || !type) {
            throw new InvalidError("Algun dato no es proporcionado");
        }

        if (!days || days.length === 0) {
            throw new InvalidError("Debe seleccionar al menos un día");
        }

        const validTypes = Object.values(TypeSchedule);
        if (!validTypes.includes(type as TypeSchedule)) {
            throw new InvalidError(`El tipo debe ser uno de: ${validTypes.join(', ')}`);
        }

        const userId = UUID.validate(id_user);
        const uuid = await this.serviceUuid.generate();
        const newid = UUID.validate(uuid);

        if (type === TypeSchedule.WORK) {
            const existingSchedules = await this.repository.getAllSchedulesByUser(userId.getValue());
            
            const hasWorkSchedule = existingSchedules.some(schedule => 
                schedule.type === TypeSchedule.WORK
            );

            if (hasWorkSchedule) {
                throw new InvalidError("El usuario ya tiene un horario de trabajo registrado");
            }
        }

        const newSchedule: Schedule = {
            id: newid,
            id_user: userId,
            title: title,
            days: days,
            start_time: start_time,
            end_time: end_time,
            active: active,
            type: type as TypeSchedule
        };


        await this.repository.addSchedule(newSchedule);
        
        return{
            message: "El horario se creo con exito",
            status: 200
        }
    }
}