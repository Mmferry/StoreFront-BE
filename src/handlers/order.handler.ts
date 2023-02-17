import { Response, Request, NextFunction, Application, Router } from 'express'
import OrderModelStore from '../models/orders.model'
import getUserId from '../utils/auth.utils'

const oStore = new OrderModelStore()

const create = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const productId: string = _req.body.productId
    const quantity: number = parseInt(_req.body.quantity)
    const userId: string = getUserId(_req)
    const status: string = _req.body.status

    const product = await oStore.addProduct(quantity, productId, userId, status)

    res.json({
      status: 'success',
      data: { ...product },
      message: 'Product added successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const orderRoutes = Router()
orderRoutes.route('/').post(create)

export default orderRoutes
