

const config1 = {
    user: 'sa',
    password: 'sa',
    server: '192.168.1.101',
    database: 'HOT2223',
    options: {
        instanceName: '',
        encrypt: true
    }
}

const { Sequelize } = require('sequelize');

const seq = new Sequelize(config1.database, config1.user, config1.password, {
    host: config1.server,
    dialect: 'mssql'
})

module.exports = seq;