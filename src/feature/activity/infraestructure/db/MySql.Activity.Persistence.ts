import { Pool, RowDataPacket } from "mysql2/promise";
import ActivitiesRepository from "../../domain/Activities.Repository";
import Activity from "../../domain/entitie/Activity";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class MySqlActivityPersistence implements ActivitiesRepository{
    constructor(
        private readonly pool : Pool
    ){}
    
    async createActivity(activity: Activity): Promise<void> {
        const query = "INSERT INTO activities (id, idUser, name, description, type, category, durationMinutes, socialType) VALUES (?, ?, ?, ?, ?, ?, ?)";

        const values = [
            activity.id.getValue(),
            activity.id_user.getValue(),
            activity.name,
            activity.description,
            activity.type,
            activity.category,
            activity.duration_minutes,
            activity.social_type
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async getAllActivitiesByUser(id_user: string): Promise<Activity[]> {
        const query = "SELECT * FROM activities WHERE idUser = ?";
        const values = [id_user]

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            return rows.map(row => ({
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                duration_minutes: row.duration_minutes,
                social_type: row.social_type
            }));

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la lista de actividades: ${message}`);
        }
    }

    async getByIdActivity(id: string): Promise<Activity | null> {
        const query = "SELECT * FROM activities WHERE id = ?";
        const values = id;

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const activity : Activity = {
                id: UUID.fromDatabase(row.id),
                id_user: UUID.fromDatabase(row.id_user),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                duration_minutes: row.duration_minutes,
                social_type: row.social_type
            }

            return activity
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }

    async deleteActivity(id: string): Promise<void> {
        const query = "DELETE FROM activities WHERE id = ?"
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