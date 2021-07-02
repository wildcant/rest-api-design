import { Router } from 'express'
import {
  createTag,
  deleteTag,
  getAllTags,
  getTag,
  updateTag,
} from './controllers'
import { createItem, getItems } from './controllers/item'
import { catcher, validate } from './middlewares'
import { uploadIcon } from './uploads'
import {
  ItemCreateSchema,
  TagCreateSchema,
  TagUpdateSchema,
} from './validations'

// Item routes
const itemRouter = Router()
itemRouter
  .route('/')
  .get(getItems)
  .post(validate(ItemCreateSchema), createItem)
  .put()
  .delete()

// Tag routes
const tagRouter = Router()
tagRouter
  .route('/')
  .get(catcher(getAllTags))
  .post(
    uploadIcon,
    validate(TagCreateSchema, { image: 'icon' }),
    catcher(createTag)
  )
tagRouter
  .route('/:tagId')
  .get(catcher(getTag))
  .put(uploadIcon, validate(TagUpdateSchema), catcher(updateTag))
  .delete(catcher(deleteTag))

// Main router
const mainRouter = Router()
mainRouter.use('/items', itemRouter)
mainRouter.use('/tags', tagRouter)

export default mainRouter
