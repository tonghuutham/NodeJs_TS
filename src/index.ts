import express from 'express'
import usesRouter from './routes/users.routes'
import databaseService from './services/databases.services'
import { defaultErrorHandle } from './middlewares/error.middlewares'

databaseService.connect()
const app = express()
const port = 3000

app.use(express.json())
app.use('/users', usesRouter)

app.use(defaultErrorHandle)

app.listen(port, () => {
  console.log(`The application is run on the port ${port}`)
})
