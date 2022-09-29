const mysql = require('mysql2');

// connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1', // localhost IP. Setting as 'localhost' threw error: ECONNREFUSED
        user: 'root',
        password: 'Root123!', 
        database: 'employeeTracker'
    }
);

module.exports = db;