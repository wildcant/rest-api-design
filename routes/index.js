const express = require('express');
const router = express.Router();
// Validation
const validate = require('../validations/validate').validate;
const schemas = require('../validations/auth.validation');
//Controller
const authorize = require('../controllers/authentication.controller').authorize;
const {
  get_all_customers,
  create_customer,
  get_customer,
} = require('../controllers/customers.controller');

router
  .route('/')
  .get(authorize, get_all_customers);

  
router
  .route('/register')
  .post(validate(schemas.register_schema), create_customer);
  
router
  .route('/login')
  .post(validate(schemas.login_schema), get_customer);

module.exports = router;