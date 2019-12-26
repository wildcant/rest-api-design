const bcrypt = require('bcrypt');
const getConnection = require('../config/dbConnection').getConnetion;

exports.customer_list = () => {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      if (err) reject(err);
      connection.query('SELECT * FROM test.customer', (error, response, fields) => {
        connection.release();
        if (error) reject(error);
        resolve(response);
      })
    });
  });
}
exports.customer_create = (customer) => {
  return new Promise((resolve, reject) => {
    getConnection(async (err, connection) => {
      if (err) reject(err);
      const {
        name, email, password } = customer;
      const hashPassword = await bcrypt.hash(password, 10);
      connection.query(`INSERT INTO test.customer (name, email, password) VALUES (?, ?, ?)`,
        [name.toLowerCase(), email.toLowerCase(), hashPassword], (error, response, fields) => {
          connection.release();
          if (error) reject(error);
          resolve(response);
        });
    })
  })
}
exports.customer_get = (customer) => {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      if (err) reject(err);
      const { email, password } = customer;
      connection.query(`SELECT * FROM test.customer WHERE email = '${email.toLowerCase()}'`, 
        async (error, customer_credentials, fields) => {
        connection.release();
        if (error) reject(error);
        if (customer_credentials.length == 1) {
          const match = await bcrypt.compare(password, customer_credentials[0].password);
          if (match) resolve('Correct password');
          resolve('Password incorrect');
        } else {
          resolve('No user with that email');
        }
      })
    });
  });
}