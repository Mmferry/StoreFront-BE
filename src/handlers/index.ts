import { Router } from 'express'
import validateToken from '../middleware/auth.middleware'
import productRoutes from './product.handler'
import usersRoutes from './user.handler'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/store', validateToken, productRoutes)

export default routes
