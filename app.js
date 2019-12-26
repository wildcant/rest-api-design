const express = require('express');
const api = require('./routes/index');

const app = express();
app.use(express.json());
app.use('/customers', api);
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));