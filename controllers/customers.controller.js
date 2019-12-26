const {
  get_all_customers,
  create_customer
} = require('../models/customers.model');

exports.customer_list = async (req, res) => {
  try {
    let data = await get_all_customers();
    // console.log(data);
    res.status(201).send(data)
  } catch (error) {
    console.log(error)
    res.status(400).send(error)
  }
}
exports.customer_create = async (req, res) => {
  const { name, email, password } = req.body
  try {
    await create_customer( name.toLowerCase(), email.toLowerCase(), password );
    res.status(201).send('Customer created successfully');
  } catch (error) {
    if (error.code == 'ER_DUP_ENTRY') {
      res.status(400).send('Este correo ya se encuentra registrado')
    } else {
      res.status(400).send(error)
    }
  }
}
