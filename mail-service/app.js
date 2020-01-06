const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const Joi = require('@hapi/joi');
const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, CORP_NAME, PORT } = require('./config/variables');
const { getConnection } = require('./config/dbConnection');
const app = express();

//Notification validation
const noti_schema = Joi.object({
  notiType: Joi.number().required(),
  name: Joi.string().required(),
  company: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
})
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) return next(error);
    next();
  }
}
//Middelware BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Model
function create_notification({notiType, name, company, email, phone}) {
  return new Promise  ((resolve, reject) => {
    getConnection(async (err, connection) => {
      if (err) reject(err);
      connection.query('INSERT INTO `test`.notification(notification_type, customer_name, customer_email, customer_phone, customer_company) VALUES (?, ?, ?, ?, ?)',
      [notiType, name, email, phone, company], (error, response) => {
        if (error) reject(error);
        connection.release();
        resolve(response);
      })
    })
  })
}
// Controller
async function notification_create(req, res) {
  const message = '<p>Test Message</p>';
  try {
    console.log(MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD)
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port: MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    let info = await transporter.sendMail({
      from: `"${CORP_NAME}", <${MAIL_USER}>`,
      to: req.body.email,
      subject: "Cotización",
      text: "Hello world",
      html: message
    });
    console.log("info");
    console.log(info);
    console.log("Message sent: %s", info.messageId);
    let saveNoti = await create_notification(req.body);
    console.log(await saveNoti);
    res.status(200).send("notification created")
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}


// Route
app.post('/send', validate(noti_schema), notification_create);

app.listen(PORT, () => console.log("Server on " + PORT));