const Joi = require('@hapi/joi');

module.exports = {
  login_schema : Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  register_schema: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({minDomainSegments: 2}).required(),
    password: Joi.string().min(8).max(15).required()
  })
}