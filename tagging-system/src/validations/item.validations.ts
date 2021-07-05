import Joi from '@hapi/joi'

export const ItemSchema = Joi.object({})

export const ItemCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.number()).required(),
})

export const ItemUpdateSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
  tags: Joi.array().items(Joi.number()),
})
