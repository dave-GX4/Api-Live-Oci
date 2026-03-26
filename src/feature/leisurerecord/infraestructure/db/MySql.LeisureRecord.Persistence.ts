import { Pool, RowDataPacket } from "mysql2/promise";
import LeisureRecordRepository from "../../domain/LeisureRecord.Repository";
import LeisureRecord from "../../domain/entitie/LeisureRecord";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class MySqlLeisureRecordPersistence implements LeisureRecordRepository{
    constructor(
        private readonly pool : Pool
    ){}
    async addCompleteActivity(leisureRecord: LeisureRecord): Promise<void> {
        const query = "INSERT INTO leisureRecords (id, idUser, idActivitie, startTime, endTime, durationMinutes, saticfaccion, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            leisureRecord.id,
            leisureRecord.id_user,
            leisureRecord.id_activitie,
            leisureRecord.start_time,
            leisureRecord.end_time,
            leisureRecord.duration_minutes,
            leisureRecord.saticfaction,
            leisureRecord.status
        ]

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async getAllByUser(id_user: string): Promise<LeisureRecord[]> {
        const query = "SELECT * FROM leisureRecords WHERE idUser = ?";
        const values = [id_user]

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            return rows.map(row => ({
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                id_activitie: UUID.fromDatabase(row.id_activitie),
                schedule_date: row.schedule_date,
                start_time: row.start_time,
                end_time: row.end_time,
                duration_minutes: row.duration_minutes,
                saticfaction: row.saticfaction,
                status: row.status
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la lista de actividades: ${message}`);
        }
    }

    async getById(id: string): Promise<LeisureRecord | null> {
        const query = "SELECT * FROM leisureRecords WHERE id = ?";
        const values = id;

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const leisureRecords : LeisureRecord = {
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                id_activitie: UUID.fromDatabase(row.id_activitie),
                start_time: row.start_time,
                end_time: row.end_time,
                duration_minutes: row.duration_minutes,
                saticfaction: row.saticfaction,
                status: row.status
            }

            return leisureRecords;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }
    
    async deleteActivityComplete(id: string): Promise<void> {
        const query = "DELETE FROM leisureRecords WHERE id = ?"
        const values = [id];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (rows.length === 0) {
                throw new NotFoundError("No se pudo eliminar la actividad");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener el servicio: ${message}`);
        }
    }
}