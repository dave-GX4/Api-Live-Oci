import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import FriendRepository from "../../domain/Fiend.Repository";
import Friend from "../../domain/entity/Friend";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";
import { RequestStatus } from "../../domain/entity/enums/Request.Status";
import { NotFoundError } from "../../../../core/errors/NotFoundError";
import UUID from "../../../../core/valueobjects/UUID";

export default class FriendMySqlPersistence implements FriendRepository {
    constructor(private readonly pool: Pool) {}

    async save(request: Friend): Promise<void> {
        try {
            const query = `
                INSERT INTO friends (id, requesterId, addresseeId, status)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    id = VALUES(id),
                    requesterId = VALUES(requesterId),
                    addresseeId = VALUES(addresseeId),
                    status = VALUES(status)
            `;
            
            const values = [
                request.id,
                request.requesterId.getValue(),
                request.addresseeId.getValue(),
                request.status
            ];

            await this.pool.execute<ResultSetHeader>(query, values);
            
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al guardar solicitud de amistad: ${message}`);
        }
    }
    
    async findBetweenUsers(userA: string, userB: string): Promise<Friend | null> {
        try {
            const query = `
                SELECT id, requesterId, addresseeId, status, createdAt, updatedAt 
                FROM friends
                WHERE (requesterId = ? AND addresseeId = ?) 
                OR (requesterId = ? AND addresseeId = ?)
                LIMIT 1
            `;
            
            const [rows] = await this.pool.execute<RowDataPacket[]>(
                query, 
                [userA, userB, userB, userA]
            );
            
            if (rows.length === 0) return null;

            const row = rows[0];
            return {
                id: row.id,
                requesterId: UUID.fromDatabase(row.requesterId),
                addresseeId: UUID.fromDatabase(row.addresseeId),
                status: row.status,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            };
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async findById(id: string): Promise<Friend | null> {
        try {
            const query = `
                SELECT id, requesterId, addresseeId, status, createdAt, updatedAt 
                FROM friends
                WHERE id = ?
                LIMIT 1
            `;
            
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [id]);
            
            if (rows.length === 0) return null;

            const row = rows[0];
            return {
                id: row.id,
                requesterId: UUID.fromDatabase(row.requesterId),
                addresseeId: UUID.fromDatabase(row.addresseeId),
                status: row.status,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            };
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async findPendingByUserId(userId: string): Promise<Friend[]> {
        try {
            const query = `
                SELECT id, requesterId, addresseeId, status, createdAt, updatedAt 
                FROM friends 
                WHERE addresseeId = ? AND status = 'pending'
                ORDER BY createdAt DESC
            `;
            
            // Ejecutamos la consulta. Pasamos userId
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId]);
            
            // Si no hay resultados, devolvemos un array vacío
            if (rows.length === 0) return [];

            // Mapeamos los resultados a tu entidad FriendRequest
            return rows.map(row => ({
                id: row.id,
                requesterId: UUID.fromDatabase(row.requesterId),
                addresseeId: UUID.fromDatabase(row.addresseeId),
                status: row.status,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            }));
            
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar solicitudes pendientes: ${message}`);
        }
    }

    async findAllFriendsByUserId(userId: string): Promise<Friend[]> {
        try {
            const query = `
                SELECT id, requesterId, addresseeId, status, createdAt, updatedAt 
                FROM friends 
                WHERE (requesterId = ? OR addresseeId = ?) 
                AND status = 'accepted'
                ORDER BY updatedAt DESC
            `;
            
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId, userId]);
            
            if (rows.length === 0) return [];

            return rows.map(row => ({
                id: row.id,
                requesterId: UUID.fromDatabase(row.requesterId),
                addresseeId: UUID.fromDatabase(row.addresseeId),
                status: row.status,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            }));
            
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async update(id: string, status: RequestStatus): Promise<void> {
        try {
            const query = `
                UPDATE friends 
                SET status = ?
                WHERE id = ?
            `;
            
            await this.pool.execute<ResultSetHeader>(query, [status, id]);
            
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const query = `DELETE FROM friend WHERE id = ?`;
            const [result] = await this.pool.execute<ResultSetHeader>(query, [id]);
            
            if (result.affectedRows === 0) {
                throw new NotFoundError('Solicitud de amistad', id, 'ID');
            }
        } catch (error) {
            if (error instanceof NotFoundError) throw error;
            throw new DatabaseOperationError(error);
        }
    }
}