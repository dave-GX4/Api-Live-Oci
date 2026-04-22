import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import ScheduleRepository from "../../domain/Schedule.Repository";
import Schedule from "../../domain/entitie/Schedule";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class MySqlSchedulePersistence implements ScheduleRepository{
    constructor(
        private readonly pool : Pool
    ){}

    async addSchedule(schedule: Schedule): Promise<void> {
        const query = `
            INSERT INTO schedules 
            (uuid, uuidUser, title, days, startTime, endTime, active, type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            schedule.uuid.getValue(),
            schedule.uuidUser.getValue(),
            schedule.title,
            JSON.stringify(schedule.days),
            schedule.startTime,
            schedule.endTime,
            schedule.active,
            schedule.type
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const mysqlError = error as { code?: string, message?: string };
            
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError("Usuario", schedule.uuidUser.getValue(), "UUID");
            }
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al crear el horario: ${message}`);
        }
    }

    async getAllSchedulesByUser(id_user: string): Promise<Schedule[]> {
        const query = "SELECT * FROM schedules WHERE uuidUser = ?";
        const values = [id_user];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);
            
            return rows.map(row => ({
                uuid: UUID.fromDatabase(row.uuid),
                uuidUser: UUID.fromDatabase(row.uuidUser),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                startTime: row.startTime,
                endTime: row.endTime,
                active: row.active,
                type: row.type
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la lista de horarios: ${message}`);
        }
    }

    async getByIdSchedule(id: string): Promise<Schedule | null> {
        const query = "SELECT * FROM schedules WHERE uuid = ?";
        const values = [id];
        
        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const schedule : Schedule = {
                uuid: UUID.fromDatabase(row.uuid),
                uuidUser: UUID.fromDatabase(row.uuidUser),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                startTime: row.startTime,
                endTime: row.endTime,
                active: row.active,
                type: row.type
            }

            return schedule;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async deleteSchedule(id: string): Promise<void> {
        const query = "DELETE FROM schedules WHERE uuid = ?"
        const values = [id];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (rows.length === 0) {
                throw new NotFoundError("No se pudo eliminar el horario");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener el servicio horario: ${message}`);
        }
    }

    async updatenSchedule(
        id: string, 
        updates: Partial<{ 
            title: string; 
            days: number[];
            startTime: string; 
            endTime: string;
            active: boolean
        }>
    ): Promise<void> {
        const fields: string[] = [];
        const values: any[] = [];

        if(updates.title !== undefined){
            fields.push("title = ?");
            values.push(updates.title);
        }

        if(updates.days !== undefined){
            fields.push("days = ?");
            values.push(JSON.stringify(updates.days));
        }

        if(updates.startTime !== undefined){
            fields.push("startTime = ?");
            values.push(updates.startTime);
        }

        if(updates.endTime !== undefined){
            fields.push("endTime = ?");
            values.push(updates.endTime);
        }

        if(updates.active !== undefined){
            fields.push("active = ?");
            values.push(updates.active);
        }

        if (fields.length === 0) return;

        const query = `UPDATE schedules SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("No se encontro la actividad");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al actualizar el horario: ${message}`);
        }
    }
}