import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecord from "../../domain/entitie/LeisureRecord";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import RawLeisureWithActivity from "../../domain/entitie/RawLeisureWithActivity";

export default class MySqlLeisureRecordPersistence implements LeisureRecordRepository{
    constructor(
        private readonly pool : Pool
    ){}

    async addActivity(leisureRecord: LeisureRecord): Promise<void> {
        const query = "INSERT INTO leisureRecords (uuid, uuidUser, uuidActivity, startTime, endTime, durationMinutes, satisfaction, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            leisureRecord.uuid.getValue(),
            leisureRecord.uuidUser.getValue(),
            leisureRecord.uuidActivity.getValue(),
            leisureRecord.startTime,
            leisureRecord.endTime,
            leisureRecord.durationMinutes,
            leisureRecord.satisfaction,
            leisureRecord.status
        ]

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const mysqlError = error as { code?: string, message?: string };
            
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError("Actividad", leisureRecord.uuidActivity.getValue(), "UUID");
            }
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al registrar actividad completada: ${message}`);
        }
    }

    async getById(id: string): Promise<LeisureRecord | null> {
        const query = "SELECT * FROM leisureRecords WHERE uuid = ?";
        const values = [id];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const leisureRecords : LeisureRecord = {
                uuid: UUID.fromDatabase(row.uuid),
                uuidUser: UUID.fromDatabase(row.uuidUser),
                uuidActivity: UUID.fromDatabase(row.uuidActivity),
                startTime: row.startTime,
                endTime: row.endTime,
                durationMinutes: row.durationMinutes,
                satisfaction: row.saticfaction,
                status: row.status
            }

            return leisureRecords;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async getAllWithActivityByUser(uuidUser: string): Promise<RawLeisureWithActivity[]> {
        const query = `
            SELECT 
                lr.uuid AS leisureUuid,
                lr.scheduleDate,
                lr.startTime,
                lr.endTime,
                lr.durationMinutes,
                lr.satisfaction,
                lr.status,
                a.uuid AS activityUuid,
                a.name AS activityName,
                a.description AS activityDescription,
                a.type AS activityType,
                a.category AS activityCategory,
                a.durationMinutes AS activityEstimatedDuration,
                a.socialType
            FROM leisureRecords lr
            INNER JOIN activities a ON lr.uuidActivity = a.uuid
            WHERE lr.uuidUser = ?
        `;
        const values = [uuidUser];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return [];
            }

            return rows.map(row => ({
                leisureUuid: UUID.fromDatabase(row.leisureUuid),
                scheduleDate: row.scheduleDate,
                startTime: row.startTime,
                endTime: row.endTime,
                durationMinutes: row.durationMinutes,
                satisfaction: row.satisfaction,
                status: row.status,
                
                activityUuid: UUID.fromDatabase(row.activityUuid),
                activityName: row.activityName,
                activityDescription: row.activityDescription,
                activityType: row.activityType,
                activityCategory: row.activityCategory,
                activityEstimatedDuration: row.activityEstimatedDuration,
                socialType: row.socialType
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener los registros de ocio y actividades: ${message}`);
        }
    }
    
    async deleteActivityComplete(id: string): Promise<void> {
        const query = "DELETE FROM leisureRecords WHERE uuid = ?";
        const values = [id];

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("Registro", id, "UUID");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al eliminar registro: ${message}`);
        }
    }

    async updateLeisureRecord(
        id: string,
        updates: Partial<{
            scheduleDate?: Date;
            startTime?: string;
            endTime?: string;
            durationMinutes?: number;
            satisfaction?: number;
            status?: string;
        }>
    ): Promise<void> {
        const fields: string[] = [];
        const values: any[] = [];

        if (updates.scheduleDate !== undefined) {
            fields.push("scheduleDate = ?");
            values.push(updates.scheduleDate);
        }
        if (updates.startTime !== undefined) {
            fields.push("startTime = ?");
            values.push(updates.startTime);
        }
        if (updates.endTime !== undefined) {
            fields.push("endTime = ?");
            values.push(updates.endTime);
        }
        if (updates.durationMinutes !== undefined) {
            fields.push("durationMinutes = ?");
            values.push(updates.durationMinutes);
        }
        if (updates.satisfaction !== undefined) {
            fields.push("satisfaction = ?");
            values.push(updates.satisfaction);
        }
        if (updates.status !== undefined) {
            fields.push("status = ?");
            values.push(updates.status);
        }

        if (fields.length === 0) return;

        const query = `UPDATE leisureRecords SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("Registro de ocio", id, "UUID");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al actualizar registro: ${message}`);
        }
    }
}