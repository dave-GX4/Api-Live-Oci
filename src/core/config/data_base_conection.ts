import mysql from 'mysql2/promise';
import dotenv from "dotenv";

dotenv.config();

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