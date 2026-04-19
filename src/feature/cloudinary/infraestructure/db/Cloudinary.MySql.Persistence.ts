import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import FilePhoto from "../../domain/entity/FilePhoto";
import { CloudinaryRepository } from "../../domain/Cloudinary.Repository";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import UUID from "../../../../core/valueobjects/UUID";

export default class CloudinaryMySQLPersistence implements CloudinaryRepository {
    constructor(
        private readonly pool: Pool
    ) {}

    async save(photo: FilePhoto): Promise<void> {
        const query = `
            INSERT INTO photos (userId, publicId) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE publicId = VALUES(publicId)
        `;
        
        const values = [
            photo.userId.getValue(), 
            photo.publicId
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const mysqlError = error as { code?: string; message?: string };
            
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError("Usuario", photo.userId.getValue(), "UUID");
            }
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al guardar la foto del usuario: ${message}`);
        }
    }

    async findByUserId(userId: string): Promise<FilePhoto | null> {
        const query = 'SELECT * FROM photos WHERE userId = ?';
        const values = [userId];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);

            if (!rows || rows.length === 0) {
                return null;
            }

            const row = rows[0];

            const photo: FilePhoto = {
                userId: UUID.fromDatabase(row.userId),
                publicId: row.publicId
            };

            return photo;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al obtener la foto del usuario: ${message}`);
        }
    }

    async deleteByUserId(userId: string): Promise<void> {
        const query = 'DELETE FROM photos WHERE userId = ?';
        const values = [userId];

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("Foto del usuario", userId, "UUID");
            }
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al eliminar la foto del usuario: ${message}`);
        }
    }

    async updatePublicId(userId: string, publicId: string): Promise<void> {
        const query = `
            INSERT INTO photos (userId, publicId) 
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE publicId = VALUES(publicId)
        `;
        
        const values = [userId, publicId];

        try {
            const [result] = await this.pool.execute<ResultSetHeader>(query, values);

            if (result.affectedRows === 0) {
                throw new NotFoundError("Usuario", userId, "UUID");
            }
        } catch (error) {
            const mysqlError = error as { code?: string; message?: string };
            
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError("Usuario", userId, "UUID");
            }
            
            if (error instanceof NotFoundError) throw error;
            
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al actualizar la foto del usuario: ${message}`);
        }
    }
}