const mysql = require('mysql');
const {
  DB,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_CONNECTIONS
} = require('./variables');

const pool = mysql.createPool({
  connectionLimit: DB_CONNECTIONS,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB
});

module.exports = {
  getConnetion: (callback) => {
    return pool.getConnection(callback);
  }
};

// Testing pool events
pool.on('acquire', function (connection) {
  console.log('acquire');
});
pool.on('connection', function (connection) {
  console.log('connection')
});
pool.on('enqueue', function () {
  console.log('enqueue');
});
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});