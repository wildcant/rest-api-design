import Joi from '@hapi/joi'
import { AUTH_PROVIDERS } from '../enums'

export const UserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.number().integer().required(),
})

export const UserCreateSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  username: Joi.string().alphanum().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.number().integer().required(),
  provider: Joi.string()
    .valid(...Object.values(AUTH_PROVIDERS))
    .required(),
  idpToken: Joi.string(),
}).when(
  Joi.object({
    provider: [AUTH_PROVIDERS.FACEBOOK, AUTH_PROVIDERS.GOOGLE],
  }).unknown(),
  {
    then: { idpToken: Joi.required() },
  }
)

export const UserLoginSchema = Joi.object({
  username: Joi.string().alphanum().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})
