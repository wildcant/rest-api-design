require('../config/dbConnection');
const getConnection = require('../config/dbConnection').getConnetion;

const customer = {};

customer.getCustomers = () => {
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

module.exports = customer;