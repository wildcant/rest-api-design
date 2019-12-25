const { getCustomers } = require('../models/customers.model');

exports.getAllCustomers = (req, res, next) => {
  getCustomers((err, response) => {
    if (err) res.status(404).send(err);
    res.status(201).send(response);
  });
}