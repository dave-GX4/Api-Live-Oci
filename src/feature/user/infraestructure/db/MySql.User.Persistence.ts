import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import UserRepository from "../../domain/User.Repository";
import User from "../../domain/entitie/User";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";
import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import { NotFoundError } from "../../../../core/errors/NotFoundError";

export default class MySqlUserPersistence implements UserRepository{
    constructor(
        private readonly pool : Pool
    ){}

    async updateUser(
        id: string, 
        updates: Partial<{
            email: string;
            password: string;
            notifications: boolean;
            interests: string[];
            topics: string[];
            description: string;
            leisureType: string | null;
        }>
    ): Promise<void> {
        const fields: string[] = [];
        const values: any[] = [];

        if (updates.email !== undefined) {
            fields.push("email = ?");
            values.push(updates.email);
        }
        if (updates.password !== undefined) {
            fields.push("password = ?");
            values.push(updates.password);
        }
        if (updates.notifications !== undefined) {
            fields.push("notifications = ?");
            values.push(updates.notifications);
        }
        if (updates.interests !== undefined) {
            fields.push("interests = ?");
            values.push(JSON.stringify(updates.interests));
        }
        if (updates.topics !== undefined) {
            fields.push("topics = ?");
            values.push(JSON.stringify(updates.topics));
        }
        if (updates.description !== undefined) {
            fields.push("description = ?");
            values.push(updates.description);
        }

        if (updates.leisureType !== undefined) {
            fields.push("leisureType = ?");
            values.push(updates.leisureType);
        }

        if (fields.length === 0) return;

        const query = `UPDATE users SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("No se encontro el usuario");
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al actualizar usuario: ${message}`);
        }
    }

    async getByIdUser(id: string): Promise<User | null> {
        const query = "SELECT * FROM users WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const user : User = {
                uuid: UUID.fromDatabase(row.uuid),
                name: row.name,
                email: Email.fromDatabase(row.email),
                password: Password.fromDatabase(row.password),
                notifications: row.notifications,
                interests: row.interests,
                topics: row.topics,
                description: row.description,
                leisureType: row.leisureType
            }

            return user
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }

    async deleteAccount(id: string): Promise<void> {
        const query = "DELETE FROM users WHERE uuid = ?"
        const values = [id];
        
        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (rows.length === 0) {
                throw new NotFoundError("No se pudo eliminar tu cuenta diculpanos :<");
            }

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener el servicio: ${message}`);
        }
    }
}