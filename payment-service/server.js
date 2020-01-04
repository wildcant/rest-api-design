var config = require('./config');
var express = require('express');
var cors = require('cors');
var mercadopago = require('mercadopago');

// Create Express Application
var app = express();

// Iniialize mercadopago SDK
mercadopago.configure({
  sandbox: true,
  access_token: config.access_token
});

app.use(cors());
app.use(express.static('client'));

// Controller
// N1
const run = function (req, res) {
  var preference = {
    items: [{
      title: 'Test',
      quantity: 1,
      unit_price: 1000
    }]
  };
  mercadopago.preferences.create(preference).then(function (data) {
    res.status(200).json(data.body.init_point);
  }).catch(function (error) {
    console.log(error);
    res.status(400).json('wrong');
  });
};

// N2
const run2 = function (req, res) {
  // Crea un objeto de preferencia
  let preference = {
    items: [{
      title: 'Mi producto',
      unit_price: 100,
      quantity: 1,
    }]
  };

  mercadopago.preferences.create(preference)
    .then(function (response) {
      console.log(global);
      // Este valor reemplazará el string "$$init_point$$" en tu HTML
      global.init_point = response.body.init_point;
      res.json(response.body.init_point);
    }).catch(function (error) {
      console.log(error);
    });
}

// Route
app.get('/preference', run)
app.get('/preference2', run2)

// Start Express Application
app.listen(config.port);
console.log('Server running on port:', config.port);