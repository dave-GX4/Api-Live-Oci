"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const Email_1 = __importDefault(require("../../../../core/valueobjects/Email"));
const Password_1 = __importDefault(require("../../../../core/valueobjects/Password"));
const ExistsError_1 = require("../../../../core/errors/ExistsError");
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
class MySQLPersistence {
    constructor(pool) {
        this.pool = pool;
    }
    async createUser(auth) {
        const query = "INSERT INTO users (uuid, name, email, password) VALUES (?, ?, ?, ?)";
        const values = [
            auth.uuid.getValue(),
            auth.name,
            auth.email.getValue(),
            auth.password.getValue()
        ];
        try {
            await this.pool.execute(query, values);
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_DUP_ENTRY') {
                throw new ExistsError_1.ExistsError(auth.email.getValue());
            }
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }
    async findUserByEmail(email) {
        const query = "SELECT * FROM users WHERE email = ?";
        const values = [email];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (rows.length === 0) {
                return null;
            }
            const row = rows[0];
            if (!row) {
                throw new DatabaseOperationError_1.DatabaseOperationError("No se encontro el usuario");
            }
            const user = {
                uuid: UUID_1.default.fromDatabase(row.uuid),
                name: row.name,
                email: Email_1.default.fromDatabase(row.email),
                password: Password_1.default.fromDatabase(row.password)
            };
            return user;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }
}
exports.default = MySQLPersistence;
