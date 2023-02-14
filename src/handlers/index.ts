import { Router } from 'express'
import usersRoutes from './user.handler'

const routes = Router()

routes.use('/users', usersRoutes)

export default routes
