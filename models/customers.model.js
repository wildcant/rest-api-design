require('../config/dbConnection');
const getConnection = require('../config/dbConnection').getConnetion;

const customer = {};

customer.getCustomers = (results) => {
  getConnection((err, connection) => {
    if (err) throw err;
    connection.query('SELECT * FROM test.customer', (error, response, fields) => {
      connection.release();
      if (error) results(error, null);
      results(null, response);
    })
  });
}

module.exports = customer;