"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DatabaseOperationError_1 = require("../../../../core/errors/DatabaseOperationError");
const UUID_1 = __importDefault(require("../../../../core/valueobjects/UUID"));
const NotFoundError_1 = require("../../../../core/errors/NotFoundError");
class MySqlSchedulePersistence {
    constructor(pool) {
        this.pool = pool;
    }
    async addSchedule(schedule) {
        const query = `
            INSERT INTO schedules 
            (uuid, uuidUser, title, days, startTime, endTime, active, type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            schedule.uuid.getValue(),
            schedule.uuidUser.getValue(),
            schedule.title,
            JSON.stringify(schedule.days),
            schedule.startTime,
            schedule.endTime,
            schedule.active,
            schedule.type
        ];
        try {
            await this.pool.execute(query, values);
        }
        catch (error) {
            const mysqlError = error;
            if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
                throw new NotFoundError_1.NotFoundError("Usuario", schedule.uuidUser.getValue(), "UUID");
            }
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al crear el horario: ${message}`);
        }
    }
    async getAllSchedulesByUser(id_user) {
        const query = "SELECT * FROM schedules WHERE uuidUser = ?";
        const values = [id_user];
        try {
            const [rows] = await this.pool.execute(query, values);
            return rows.map(row => ({
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuidUser),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                startTime: row.startTime,
                endTime: row.endTime,
                active: row.active,
                type: row.type
            }));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener la lista de horarios: ${message}`);
        }
    }
    async getByIdSchedule(id) {
        const query = "SELECT * FROM schedules WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (!rows || rows.length === 0) {
                return null;
            }
            const row = rows[0];
            const schedule = {
                uuid: UUID_1.default.fromDatabase(row.uuid),
                uuidUser: UUID_1.default.fromDatabase(row.uuidUser),
                title: row.title,
                days: typeof row.days === 'string' ? JSON.parse(row.days) : row.days,
                startTime: row.startTime,
                endTime: row.endTime,
                active: row.active,
                type: row.type
            };
            return schedule;
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al buscar la actividad: ${message}`);
        }
    }
    async deleteSchedule(id) {
        const query = "DELETE FROM schedules WHERE uuid = ?";
        const values = [id];
        try {
            const [rows] = await this.pool.execute(query, values);
            if (rows.length === 0) {
                throw new NotFoundError_1.NotFoundError("No se pudo eliminar el horario");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al obtener el servicio horario: ${message}`);
        }
    }
    async updatenSchedule(id, updates) {
        const fields = [];
        const values = [];
        if (updates.title !== undefined) {
            fields.push("title = ?");
            values.push(updates.title);
        }
        if (updates.days !== undefined) {
            fields.push("days = ?");
            values.push(JSON.stringify(updates.days));
        }
        if (updates.startTime !== undefined) {
            fields.push("startTime = ?");
            values.push(updates.startTime);
        }
        if (updates.endTime !== undefined) {
            fields.push("endTime = ?");
            values.push(updates.endTime);
        }
        if (updates.active !== undefined) {
            fields.push("active = ?");
            values.push(updates.active);
        }
        if (fields.length === 0)
            return;
        const query = `UPDATE schedules SET ${fields.join(", ")} WHERE uuid = ?`;
        values.push(id);
        try {
            const [result] = await this.pool.execute(query, values);
            if (result.affectedRows === 0) {
                throw new NotFoundError_1.NotFoundError("No se encontro la actividad");
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            throw new DatabaseOperationError_1.DatabaseOperationError(`Error al actualizar el horario: ${message}`);
        }
    }
}
exports.default = MySqlSchedulePersistence;
