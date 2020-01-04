const bcrypt = require('bcrypt');
const { getConnection  } = require('../config/dbConnection');


/** Get customers list
 * @method
 * @returns {Prmise<Array>}
 */
exports.get_all_customers = () => {
  return new Promise((resolve, reject) => {
    getConnection((err, connection) => {
      if (err) reject(err);
      connection.query('SELECT * FROM test.customer', (error, response) => {
        connection.release();
        if (error) reject(error);
        resolve(response);
      })
    });
  });
}
/** Create new customer account
 * @returns {}
 */
exports.create_customer = (name, email, password) => {
  return new Promise((resolve, reject) => {
    getConnection(async (err, connection) => {
      if (err) reject(err);
      const hashPassword = await bcrypt.hash(password, 10);
      connection.query(`INSERT INTO test.customer (name, email, password) VALUES (?, ?, ?)`,
        [name, email, hashPassword], (error, response) => {
          connection.release();
          if (error) reject(error);
          resolve(response);
        });
    })
  })
}

exports.get_customer_by_email = (email) => {
  return new Promise((resolve, reject) => {
    getConnection(async (err, connection) => {
      if (err) reject(err);
      connection.query(`SELECT * FROM test.customer WHERE email = ?`,
        [email.toLowerCase()], async (error, credentials) => {
          connection.release();
          if (error) reject(error);
          let user = Object.assign({}, credentials[0])
          resolve(user);
        });
    })
  })
}