"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class MySqlLeisureRecordPersistence {
    constructor(pool) {
        this.pool = pool;
    }
    async addActivity(leisureRecord) {
        const query = "INSERT INTO leisureRecords (uuid, uuidUser, uuidActivity, startTime, endTime, durationMinutes, satisfaction, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            leisureRecord.uuid.getValue(),
            leisureRecord.uuidUser.getValue(),
            leisureRecord.uuidActivity.getValue(),
            leisureRecord.startTime,
            leisureRecord.endTime,
            leisureRecord.durationMinutes,
            leisureRecord.satisfaction,
            leisureRecord.status
        ];
        try {
            await this.pool.execute(query, values);
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError_1.NotFoundError("Actividad", leisureRecord.uuidActivity.getValue(), "UUID");
            }
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al registrar actividad completada: ${message}`);
        }
    }
    async getAllByUser(id) {
        const query = "SELECT * FROM leisureRecords WHERE uuidUser = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            return rows.map(row => ({
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuid_user),
                uuidActivity: UUID_1.default.fromDatabase(row.uuidActivity),
                scheduleDate: row.scheduleDate,
                startTime: row.startTime,
                endTime: row.endTime,
                durationMinutes: row.durationMinutes,
                satisfaction: row.saticfaction,
                status: row.status
            }));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener la lista de actividades: ${message}`);
        }
    }
    async getById(id) {
        const query = "SELECT * FROM leisureRecords WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (!rows || rows.length === 0) {
                return null;
            }
            const row = rows[0];
            const leisureRecords = {
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuidUser),
                uuidActivity: UUID_1.default.fromDatabase(row.uuidActivity),
                startTime: row.startTime,
                endTime: row.endTime,
                durationMinutes: row.durationMinutes,
                satisfaction: row.saticfaction,
                status: row.status
            };
            return leisureRecords;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }
    async deleteActivityComplete(id) {
        const query = "DELETE FROM leisureRecords WHERE uuid = ?";
        const values = [id];
        try {
            const [result] = await this.pool.execute(query, values);
            if (result.affectedRows === 0) {
                throw new NotFoundError_1.NotFoundError("Registro", id, "UUID");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al eliminar registro: ${message}`);
        }
    }
    async updateLeisureRecord(id, updates) {
        const fields = [];
        const values = [];
        if (updates.scheduleDate !== undefined) {
            fields.push("scheduleDate = ?");
            values.push(updates.scheduleDate);
        }
        if (updates.startTime !== undefined) {
            fields.push("startTime = ?");
            values.push(updates.startTime);
        }
        if (updates.endTime !== undefined) {
            fields.push("endTime = ?");
            values.push(updates.endTime);
        }
        if (updates.durationMinutes !== undefined) {
            fields.push("durationMinutes = ?");
            values.push(updates.durationMinutes);
        }
        if (updates.satisfaction !== undefined) {
            fields.push("satisfaction = ?");
            values.push(updates.satisfaction);
        }
        if (updates.status !== undefined) {
            fields.push("status = ?");
            values.push(updates.status);
        }
        if (fields.length === 0)
            return;
        const query = `UPDATE leisureRecords SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);
        try {
            const [result] = await this.pool.execute(query, values);
            if (result.affectedRows === 0) {
                throw new NotFoundError_1.NotFoundError("Registro de ocio", id, "UUID");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al actualizar registro: ${message}`);
        }
    }
}
exports.default = MySqlLeisureRecordPersistence;
