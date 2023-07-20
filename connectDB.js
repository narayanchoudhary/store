const seq = require('./db.js');

const connectDB = async () => {
    try {
        await seq.authenticate();
        console.log('Connected DB')
    } catch (err) {

        console.error('unable to connect', err.message)
    }
}

module.exports = connectDB;