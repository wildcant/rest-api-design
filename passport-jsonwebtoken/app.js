const express = require('express');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const api = require('./routes/index');
require('./config/passport');

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(express.static('client'));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

app.use('/customers', api);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));