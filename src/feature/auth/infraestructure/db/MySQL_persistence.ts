import { Pool, RowDataPacket } from "mysql2/promise";
import Auth from "../../domain/entitie/auth";
import AuthRepository from "../../domain/auth_repository";
import UUID from "../../../../core/valueobjects/UUID";
import Email from "../../../../core/valueobjects/Email";
import Password from "../../../../core/valueobjects/Password";
import { ExistsError } from "../../../../core/errors/ExistsError";
import { DatabaseOperationError } from "../../../../core/errors/DatabaseOperationError";

export default class MySQLPersistence implements AuthRepository{
    constructor(
        private readonly pool: Pool
    ) { }

    async createUser(auth: Auth): Promise<void> {
        const query = "INSERT INTO users (uuid, name, email, password) VALUES (?, ?, ?, ?)";

        const values = [
            auth.id.getValue(),
            auth.name,
            auth.email.getValue(),
            auth.password.getValue()
        ];

        try {
            await this.pool.execute(query, values);
        } catch (error) {
            const mysqlError = error as { code?: string, message?: string };

            if (mysqlError.code === 'ER_DUP_ENTRY') {
                throw new ExistsError(auth.email.getValue());
            }

            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }
    
    async findUserByEmail(email: string): Promise<Auth | null> {
        const query = "SELECT * FROM users WHERE email = ?";
        const values = [email];

        try {
            const [rows] = await this.pool.execute<RowDataPacket[]>(query, values);
            if (rows.length === 0) {
                return null;
            }
            const row = rows[0];

            if(!row){
                throw new DatabaseOperationError("No se encontro el usuario");
            }
            
            const user: Auth = {
                id: UUID.fromDatabase(row.id_user),
                name: row.name_user,
                email: Email.fromDatabase(row.email),
                password: Password.fromDatabase(row.password)
            };

            return user;

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }
}