const sql = require('mssql');
const fs = require('fs');

const config = {
    server: 'ASUS-PC',
    authentication: {
        type: 'default',
        options: { userName: 'SA', password: 'open' },
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    database: 'Hariom',
};

// Create a writable stream to log output
const logStream = fs.createWriteStream('output.log', { flags: 'a' });

// Function to connect to the database and return the pool object
async function getPool() {
    try {
        const pool = new sql.ConnectionPool(config);
        await pool.connect();
        logStream.write('Connected to SQL Server.\n'); // Write to log stream
        return pool;
    } catch (error) {
        logStream.write(`${error}\n`); // Write error to log stream
        // throw error;
    }
}

module.exports = {
    getPool,
};
