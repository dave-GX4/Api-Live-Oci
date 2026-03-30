import mysql from 'mysql2/promise';
import { env } from './env.config';

const dbConfig = {
    host: env.database.host,
    user: env.database.user,
    password: env.database.pass,
    database: env.database.name,
    port: env.database.port,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

pool.getConnection()
    .then(connection => {
        console.log('Conexión exitosa a MySQL (Pool activo)');
        connection.release();
    })
    .catch(err => {
        console.error('Error conectando a MySQL:', err);
    });

export default pool;