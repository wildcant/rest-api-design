import express from 'express'
import passport from 'passport'
import rootRouter from './routes'
import { localStrategy, jwtStrategy } from './auth'
import { errorHandler } from './helpers'

const app = express()

localStrategy()
jwtStrategy()
app.use(express.json())
app.use(passport.initialize())
app.use('/', rootRouter)
app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http:localhost:${PORT}`)
)
