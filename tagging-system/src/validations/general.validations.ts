import Joi from '@hapi/joi'

export const FileSchema = Joi.object({
  fieldname: Joi.string().required(),
  originalname: Joi.string(),
  encoding: Joi.string(),
  mimetype: Joi.string(),
  destination: Joi.string(),
  filename: Joi.string().required(),
  path: Joi.string(),
  size: Joi.number().required(),
})

export const FilesSchema = Joi.array().items(FileSchema)
