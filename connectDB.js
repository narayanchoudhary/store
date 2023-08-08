const sql = require('mssql');

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

// Function to connect to the database and return the pool object
async function getPool() {
    try {
        const pool = new sql.ConnectionPool(config);
        await pool.connect();
        console.log('Connected to SQL Server.');
        return pool;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getPool,
};
