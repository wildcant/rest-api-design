import Joi from '@hapi/joi'

export const TagSchema = Joi.object({})

export const TagCreateSchema = Joi.object({
  name: Joi.string().required(),
})
export const TagUpdateSchema = Joi.object({
  name: Joi.string(),
})
