import { Router } from 'express'
import validateToken from '../middleware/auth.middleware'
import orderRoutes from './order.handler'
import productRoutes from './product.handler'
import usersRoutes from './user.handler'

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/product', validateToken, productRoutes)
routes.use('/order', validateToken, orderRoutes)

export default routes
