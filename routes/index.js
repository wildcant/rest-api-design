const express = require('express');
const router = express.Router();
// Validation
const validate = require('../validations/validate').validate;
const schemas = require('../validations/auth.validation');
//Controller
const {
  customer_list,
  customer_create
} = require('../controllers/customers.controller');
const { 
  authenticate_customer,
  authorize
} = require('../middlewares/auth');

router
  .route('/')
  .get( customer_list);

router
  .route('/register')
  .post(validate(schemas.register_schema), customer_create);
    
router
  .route('/login')
  .post(validate(schemas.login_schema), authenticate_customer);
  
router
  .route('/protected')
  .get(authorize, (req, res)=> {
    res.status(200).send('Access granted');
  });
module.exports = router;