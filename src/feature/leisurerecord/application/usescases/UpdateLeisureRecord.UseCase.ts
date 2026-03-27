import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecordResponseDto from "../dto/LeisureRecordResponseDto";

export default class UpdateLeisureRecordUseCase {
    constructor(
        private readonly leisureRepository: LeisureRecordRepository,
    ) {}

    async run(
        uuidLeisureRecord: string,
        updates: {
            scheduleDate?: Date;
            startTime?: string;
            endTime?: string;
            satisfaction?: number;
            status?: 'programado' | 'en_progreso' | 'completado' | 'cancelado';
        }
    ): Promise<LeisureRecordResponseDto> {
        
        const recordId = UUID.validate(uuidLeisureRecord);

        const record = await this.leisureRepository.getById(recordId.getValue());
        if (!record) {
            throw new NotFoundError("Registro de ocio", uuidLeisureRecord, "UUID");
        }

        let duration = record.durationMinutes;
        if (updates.startTime && updates.endTime) {
            duration = this.calculateDuration(updates.startTime, updates.endTime);
        }

        const updateData: any = {};
        
        if (updates.scheduleDate !== undefined) updateData.scheduleDate = updates.scheduleDate;
        if (updates.startTime !== undefined) updateData.startTime = updates.startTime;
        if (updates.endTime !== undefined) updateData.endTime = updates.endTime;
        if (updates.satisfaction !== undefined) updateData.satisfaction = updates.satisfaction;
        if (updates.status !== undefined) updateData.status = updates.status;
    
        if (updates.startTime && updates.endTime) {
            updateData.durationMinutes = duration;
        }

        await this.leisureRepository.updateLeisureRecord(recordId.getValue(), updateData);

        return {
            message: "Registro de ocio actualizado correctamente",
            status: 200
        };
    }

    private calculateDuration(start: string, end: string): number {
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return (endH * 60 + endM) - (startH * 60 + startM);
    }
}