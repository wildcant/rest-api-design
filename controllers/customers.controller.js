const {
  customer_list,
  customer_create,
  customer_get
} = require('../models/customers.model');

exports.get_all_customers = async (req, res) => {
  try {
    let data = await customer_list();
    // console.log(data);
    res.status(201).send(data)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}
exports.create_customer = async (req, res) => {
  try {
    let success = await customer_create(req.body);
    res.status(201).send('success');
  } catch (error) {
    if (error.code == 'ER_DUP_ENTRY') {
      res.status(400).send('Este correo ya se encuentra registrado')
    } else {
      res.status(400).send(error)
    }
  }
}
exports.get_customer = async (req, res) => {
  try {
    let response = await customer_get(req.body);
    res.status(201).send(response);
  } catch (error) {
    res.status(400).send(error)
  }
}