import express from 'express'
import rootRouter from './routes'
import { errorHandler } from './middlewares'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', rootRouter)

app.use(errorHandler)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () =>
  console.log(`🚀 Server ready at: http:localhost:${PORT}`)
)
