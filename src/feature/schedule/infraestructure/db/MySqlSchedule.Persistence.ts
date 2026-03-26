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
        const query = "INSERT JOIN schedules (id, idUser, title, days, startTime, endTime, active, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [
            schedule.id.getValue(),
            schedule.id_user.getValue(),
            schedule.title,
            JSON.stringify(schedule.days),
            schedule.start_time,
            schedule.end_time,
            schedule.active,
            schedule.type
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar el horario: ${message}`);
        }
    }

    async getAllSchedulesByUser(id_user: string): Promise<Schedule[]> {
        const query = "SELECT * FROM schedules WHERE idUser = ?";
        const values = [id_user];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);
            
            return rows.map(row => ({
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                start_time: row.start_time,
                end_time: row.end_time,
                active: row.active,
                type: row.type
            }));
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la lista de horarios: ${message}`);
        }
    }

    async getByIdSchedule(id: string): Promise<Schedule | null> {
        const query = "SELECT * FROM schedules WHERE id = ?";
        const values = id;
        
        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const schedule : Schedule = {
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                start_time: row.start_time,
                end_time: row.end_time,
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
        const query = "DELETE FROM schedules WHERE id = ?"
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
            start_time: string; 
            end_time: string;
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

        if(updates.start_time !== undefined){
            fields.push("startTime = ?");
            values.push(updates.start_time);
        }

        if(updates.end_time !== undefined){
            fields.push("endTime = ?");
            values.push(updates.end_time);
        }

        if(updates.active !== undefined){
            fields.push("active = ?");
            values.push(updates.active);
        }

        if (fields.length === 0) return;

        const query = `UPDATE schedules SET ${fields.join(", ")} WHERE id = ?`;
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