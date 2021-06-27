import { Router } from 'express'
import { authorize, login } from '../auth'
import { createUser, getUsers } from '../controllers/user.controllers'
import { validate } from '../helpers'
import { UserCreateSchema, UserLoginSchema } from '../validations'

// User routes
const userRouter = Router()
userRouter.get('/', authorize, getUsers)
userRouter.post('/', validate(UserCreateSchema), createUser)
userRouter.post('/login', validate(UserLoginSchema), login)

export default userRouter
