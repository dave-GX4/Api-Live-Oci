import InvalidError from "../../../../core/errors/InvalidError";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import ScheduleRepository from "../../domain/Schedule.Repository";
import ScheduleResponseDto from "../dto/ScheduleResponseDto";

export default class UpdateScheduleUseCase {
    constructor(
        private readonly repository: ScheduleRepository
    ) {}

    async run(
        id: string,
        title?: string,
        days?: number[],
        startTime?: string,
        endTime?: string,
        active?: boolean,
    ): Promise<ScheduleResponseDto> {
        const idValue = UUID.validate(id);

        const schedule = await this.repository.getByIdSchedule(idValue.getValue());
        if (!schedule) {
            throw new NotFoundError("Horario", id, "UUID");
        }

        const updates: any = {};
        
        if (title !== undefined) updates.title = title.trim();
        if (days !== undefined) {
            const validDays = days.every(d => Number.isInteger(d) && d >= 0 && d <= 6);
            if (!validDays) {
                throw new InvalidError("Los días deben ser números del 0 al 6");
            }
            updates.days = days;
        }
        if (startTime !== undefined) {
            if (!this.isValidTimeFormat(startTime)) {
                throw new InvalidError("Formato de hora inicio inválido (use HH:MM)");
            }
            updates.startTime = startTime;
        }
        if (endTime !== undefined) {
            if (!this.isValidTimeFormat(endTime)) {
                throw new InvalidError("Formato de hora fin inválido (use HH:MM)");
            }
            updates.endTime = endTime;
        }
        if (active !== undefined) updates.active = active;

        if (Object.keys(updates).length === 0) {
            return {
                message: "No se proporcionaron cambios",
                status: 200
            };
        }

        await this.repository.updatenSchedule(idValue.getValue(), updates);

        return {
            message: "Se actualizó correctamente el horario",
            status: 200
        };
    }

    private isValidTimeFormat(time: string): boolean {
        return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
    }
}