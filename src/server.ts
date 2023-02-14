import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import config from './config'
import routes from './handlers'

const app: Application = express()
const PORT = config.port || 3000

app.use(bodyParser.json())
app.use('/api', routes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: 'Seems you are lost, Read the API documentation in REQUIREMENTS file to find a way.'
  })
})

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
