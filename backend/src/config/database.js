const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'vehicle_maintenance'
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

module.exports = pool; 
