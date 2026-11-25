// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Tu usuario de MySQL (suele ser root)
    password: 'root', // Pon la contraseña de tu MySQL Workbench
    database: 'paw_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;