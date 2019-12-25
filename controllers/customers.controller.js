const {
  getCustomers
} = require('../models/customers.model');

exports.getAllCustomers = async (req, res, next) => {
  try {
    let data = await getCustomers();
    // console.log(data);
    res.status(201).send(data)
  } catch (error) {
    console.log(error)
    res.status(404).send(error)
  }
}