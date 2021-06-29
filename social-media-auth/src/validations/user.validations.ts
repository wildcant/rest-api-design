import Joi from '@hapi/joi'
import { AuthProviders } from '../enums'

export const UserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
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
  externalId: Joi.string(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.number().integer(),
  photo: Joi.string().allow(null),
  provider: Joi.string()
    .valid(...Object.values(AuthProviders))
    .required(),
})
  .when(
    Joi.object({
      provider: [AuthProviders.FACEBOOK, AuthProviders.GOOGLE],
    }).unknown(),
    {
      then: { externalId: Joi.required() },
    }
  )
  .when(
    Joi.object({
      provider: [AuthProviders.LOCAL],
    }).unknown(),
    {
      then: { password: Joi.required() },
    }
  )

export const UserLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})
