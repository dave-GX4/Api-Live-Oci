"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const env_config_1 = require("./env.config");
const dbConfig = {
    host: env_config_1.env.database.host,
    user: env_config_1.env.database.user,
    password: env_config_1.env.database.pass,
    database: env_config_1.env.database.name,
    port: env_config_1.env.database.port,
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
