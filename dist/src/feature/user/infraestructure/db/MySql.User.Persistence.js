"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const Email_1 = __importDefault(require("../../../../core/valueobjects/Email"));
const Password_1 = __importDefault(require("../../../../core/valueobjects/Password"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class MySqlUserPersistence {
    constructor(pool) {
        this.pool = pool;
    }
    async updateUser(id, updates) {
        const fields = [];
        const values = [];
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
        if (fields.length === 0)
            return;
        const query = `UPDATE users SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);
        try {
            const [result] = await this.pool.execute(query, values);
            if (result.affectedRows === 0) {
                throw new NotFoundError_1.NotFoundError("No se encontro el usuario");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al actualizar usuario: ${message}`);
        }
    }
    async getByIdUser(id) {
        const query = "SELECT * FROM users WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (!rows || rows.length === 0) {
                return null;
            }
            const row = rows[0];
            const user = {
                uuid: UUID_1.default.fromDatabase(row.uuid),
                name: row.name,
                email: Email_1.default.fromDatabase(row.email),
                password: Password_1.default.fromDatabase(row.password),
                notifications: row.notifications,
                interests: row.interests,
                topics: row.topics,
                description: row.description,
                leisureType: row.leisureType
            };
            return user;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar usuario: ${message}`);
        }
    }
    async deleteAccount(id) {
        const query = "DELETE FROM users WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (rows.length === 0) {
                throw new NotFoundError_1.NotFoundError("No se pudo eliminar tu cuenta diculpanos :<");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener el servicio: ${message}`);
        }
    }
}
exports.default = MySqlUserPersistence;
