import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import FriendRequestRepository from "../../domain/FiendRequest.Repository";
import FriendRequest from "../../domain/entity/FriendRequest";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class FriendRequestMySqlPersistence implements FriendRequestRepository {
    constructor(private readonly pool: Pool) {}

    async save(request: FriendRequest): Promise<void> {
        try {
            const query = `
                INSERT INTO friendRequests (id, requesterId, addresseeId, status)
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
    
    async findBetweenUsers(userA: string, userB: string): Promise<FriendRequest | null> {
        try {
            const query = `
                SELECT id, requesterId, addresseeId, status, createdAt, updatedAt 
                FROM friendRequests 
                WHERE (requesterId = ? AND addresseeId = ?) 
                OR (requesterId = ? AND addresseeId = ?)
                LIMIT 1
            `;
            
            const [rows] = await this.pool.execute<RowDataPacket[]>(
                query, 
                [userA, userB, userB, userA]  // Ambas direcciones
            );
            
            if (rows.length === 0) return null;

            const row = rows[0];
            return {
                id: row.id,
                requesterId: row.requesterId,
                addresseeId: row.addresseeId,
                status: row.status,
                createdAt: row.createdAt,
                updatedAt: row.updatedAt
            };
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }
}