"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
const InvalidError_1 = __importDefault(require("../../../../core/errors/InvalidError"));
class MySqlActivityPersistence {
    constructor(pool) {
        this.pool = pool;
    }
    async createActivity(activity) {
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
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new InvalidError_1.default("El usuario no existe");
            }
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al crear la actividad: ${message}`);
        }
    }
    async getAllActivitiesByUser(idUser) {
        const query = "SELECT * FROM activities WHERE uuidUser = ?";
        const values = [idUser];
        try {
            const [rows] = await this.pool.execute(query, values);
            return rows.map(row => ({
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuidUser),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                durationMinutes: row.durationMinutes,
                socialType: row.socialType
            }));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener la lista de actividades: ${message}`);
        }
    }
    async getByIdActivity(id) {
        const query = "SELECT * FROM activities WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (!rows || rows.length === 0) {
                return null;
            }
            const row = rows[0];
            const activity = {
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuidUser),
                name: row.name,
                description: row.description,
                type: row.type,
                category: row.category,
                durationMinutes: row.durationMinutes,
                socialType: row.socialType
            };
            return activity;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }
    async deleteActivity(id) {
        const query = "DELETE FROM activities WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (rows.length === 0) {
                throw new NotFoundError_1.NotFoundError("No se pudo eliminar la actividad");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener el servicio: ${message}`);
        }
    }
}
exports.default = MySqlActivityPersistence;
