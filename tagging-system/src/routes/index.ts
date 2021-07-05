import { Router } from 'express'
import { itemRouter } from './item'
import { tagRouter } from './tag'

const mainRouter = Router()
mainRouter.use('/items', itemRouter)
mainRouter.use('/tags', tagRouter)

export default mainRouter
