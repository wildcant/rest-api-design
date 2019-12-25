const express = require('express');
const router = express.Router();
const { authorize } = require('../controllers/authentication.controller');
const { getAllCustomers } = require('../controllers/customers.controller');

router
  .route('/login')
  .get(authorize , getAllCustomers);

module.exports = router;