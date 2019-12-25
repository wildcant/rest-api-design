const express = require('express');
const api = require('./routes/index');

const app = express();
app.use('/customers', api);

const port = process.env.PORT || 3000;
app.listen(port);