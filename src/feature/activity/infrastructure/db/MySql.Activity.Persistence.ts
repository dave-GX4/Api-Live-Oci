import { Pool, RowDataPacket } from "mysql2/promise";
import ActivitiesRepository from "../../domain/Activities.Repository";
import Activity from "../../domain/entity/Activity";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import InvalidError from "../../../../core/errors/InvalidError";

export default class MySqlActivityPersistence implements ActivitiesRepository{
    constructor(
        private readonly pool : Pool
    ){}
    
    async createActivity(activity: Activity): Promise<void> {
        const query = `
            INSERT INTO activities 
            (uuid, uuidUser, name, description, type, category, durationMinutes, socialType) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            activity.uuid.getValue(),
            activity.uuidUser.getValue(),
            activity.name,
            activity.description,
            activity.type,
            activity.category,
            activity.durationMinutes,
            activity.socialType
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const mysqlError = error as { code?: string, message?: string };
            
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new InvalidError("El usuario no existe");
            }
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al crear la actividad: ${message}`);
        }
    }

    async getAllActivitiesByUser(idUser: string): Promise<Activity[]> {
        const query = "SELECT * FROM activities WHERE uuidUser = ?";
        const values = [idUser]

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            return rows.map(row => ({
                uuid: UUID.fromDatabase(row.uuid),
                uuidUser: UUID.fromDatabase(row.uuidUser),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                durationMinutes: row.durationMinutes,
                socialType: row.socialType
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la lista de actividades: ${message}`);
        }
    }

    async getByIdActivity(id: string): Promise<Activity | null> {
        const query = "SELECT * FROM activities WHERE uuid = ?";
        const values = [id];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const activity : Activity = {
                uuid: UUID.fromDatabase(row.uuid),
                uuidUser: UUID.fromDatabase(row.uuidUser),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                durationMinutes: row.durationMinutes,
                socialType: row.socialType
            }

            return activity
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async deleteActivity(id: string): Promise<void> {
        const query = "DELETE FROM activities WHERE uuid = ?"
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