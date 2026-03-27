"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number.parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
};
const pool = promise_1.default.createPool(dbConfig);
pool.getConnection()
    .then(connection => {
    console.log('Conexión exitosa a MySQL (Pool activo)');
    connection.release();
})
    .catch(err => {
    console.error('Error conectando a MySQL:', err);
});
exports.default = pool;
