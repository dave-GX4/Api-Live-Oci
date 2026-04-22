import { Pool, RowDataPacket } from "mysql2/promise";
import CodeRepository from "../../domain/Code.Repository";
import FriendCode from "../../domain/entity/FriendCode";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class CodeMySqlPersistence implements CodeRepository{
    constructor(
        private readonly pool: Pool
    ){}

    async saveCodeUser(
        userId: string,
        code: FriendCode
    ): Promise<void> {
        try {
            const query = `INSERT INTO friendCodes (id, userId, code, expiresAt) VALUES (?, ?, ?, ?)`;
            
            const stringId = code.id.getValue();

            await this.pool.execute(query, [stringId, userId, code.code, code.expiresAt]);
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async getCodeByUser(userId: string): Promise<FriendCode | null> {
        try {
            const query = `SELECT * FROM friendCodes WHERE userId = ? LIMIT 1`;
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [userId]);
            
            if (rows.length === 0) return null;
            return rows[0] as FriendCode;
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async updateCodeUser(
        userId: string, 
        updates: { 
                code: string; 
                expiresAt: Date; 
                regeneratedAt: Date; 
            }
        ): Promise<void> {
        try {
            const query = `UPDATE friendCodes SET code = ?, expiresAt = ?, regeneratedAt = ? WHERE userId = ?`;
            await this.pool.execute(
                query, 
                [updates.code, updates.expiresAt, updates.regeneratedAt, userId]
            );
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }

    async getExpiredUsersIds(currentDate: Date): Promise<string[]> {
        try {
            // Buscamos donde la fecha de expiración sea MENOR o IGUAL a la fecha de hoy
            const query = `SELECT userId FROM friendCodes WHERE expiresAt <= ?`;
            
            // Pasamos la fecha como parámetro
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, [currentDate]);
            
            // Transformamos el resultado de la DB a un simple arreglo de IDs ["123", "456"]
            return rows.map(row => row.userId as string);
        } catch (error) {
            throw new DatabaseOperationError(error);
        }
    }
}