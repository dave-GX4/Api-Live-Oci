import InvalidError from "../../../../core/errors/InvalidError";
import UuidService from "../../../../core/services/interface/I.Uuid.Service";
import UUID from "../../../../core/valueobjects/UUID";
import Schedule from "../../domain/entitie/Schedule";
import ScheduleRepository from "../../domain/Schedule.Repository";
import ScheduleResponseDto from "../dto/ScheduleResponseDto";

export default class AddScheduleUsesCase {
    constructor(
        private readonly repository: ScheduleRepository,
        private readonly serviceUuid: UuidService
    ) {}

    async run(
        idUser: string,
        title: string,
        days: number[],
        startTime: string,
        endTime: string,
        active: boolean,
        type: string
    ): Promise<ScheduleResponseDto> {

        enum TypeSchedule {
            WORK = "trabajo",
            SCHOOL = "escuela",
            CUSTOM = "personalizado"
        }

        if (!idUser?.trim()) {
            throw new InvalidError("El ID de usuario es requerido");
        }
        if (!title?.trim()) {
            throw new InvalidError("El título es requerido");
        }
        if (!startTime?.trim()) {
            throw new InvalidError("La hora de inicio es requerida");
        }
        if (!endTime?.trim()) {
            throw new InvalidError("La hora de fin es requerida");
        }
        if (active === undefined) {
            throw new InvalidError("El estado activo es requerido");
        }
        if (!type?.trim()) {
            throw new InvalidError("El tipo es requerido");
        }

        if (!days || days.length === 0) {
            throw new InvalidError("Debe seleccionar al menos un día");
        }

        const validDays = days.every(d => Number.isInteger(d) && d >= 0 && d <= 6);
        if (!validDays) {
            throw new InvalidError("Los días deben ser números del 0 (domingo) al 6 (sábado)");
        }

        const validTypes = Object.values(TypeSchedule);
        if (!validTypes.includes(type as TypeSchedule)) {
            throw new InvalidError(`El tipo debe ser uno de: ${validTypes.join(', ')}`);
        }

        const userId = UUID.validate(idUser);
        const uuid = await this.serviceUuid.generate();
        const newid = UUID.validate(uuid);

        if (type === TypeSchedule.WORK || type === TypeSchedule.SCHOOL) {
            const existingSchedules = await this.repository.getAllSchedulesByUser(userId.getValue());
            
            const hasExistingSchedule = existingSchedules.some(schedule => 
                schedule.type === type
            );

            if (hasExistingSchedule) {
                const nombreTipo = type === TypeSchedule.WORK ? "trabajo" : "escuela";
                throw new InvalidError(`El usuario ya tiene un horario de ${nombreTipo} registrado.`);
            }
        }

        const newSchedule: Schedule = {
            uuid: newid,
            uuidUser: userId,
            title: title.trim(),
            days: days,
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            active: active,
            type: type as TypeSchedule
        };

        await this.repository.addSchedule(newSchedule);
        
        return {
            message: "El horario se creó con éxito",
            status: 201,
        };
    }
}