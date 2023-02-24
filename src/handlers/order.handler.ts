import { Response, Request, Router } from 'express'
import OrderModelStore from '../models/orders.model'
import getUserId from '../utils/auth.utils'
import DashboardQueries from '../services/dashboard'
import { Status } from '../interfaces/order.interface'

const oStore = new OrderModelStore()
const dashboardQueries = new DashboardQueries()

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await oStore.index()

    res.json({
      status: 'success',
      data: orders,
      message: 'orders retrieved successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const orders = await oStore.show(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: orders,
      message: 'orders retrieved successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const create = async (_req: Request, res: Response) => {
  try {
    const userId: string = _req.body.user_id || getUserId(_req)
    const status: Status = _req.body.status

    if (!userId || !status) {
      return res.status(400).json({
        error: 'one or more parameters are missing'
      })
    }

    const order = await oStore.create({
      user_id: parseInt(userId as string),
      status: status
    })

    res.json({
      status: 'success',
      data: { ...order },
      message: 'Your order has been added successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const order = await oStore.update(req.body)

    res.json({
      status: 'success',
      data: order,
      message: 'order updated successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

export const deleteHandler = async (req: Request, res: Response) => {
  try {
    const order = await oStore.delete(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: order,
      message: 'order deleted successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const addProductToOrder = async (req: Request, res: Response) => {
  try {
    const quantity = +req.body.quantity
    const product_id = +req.body.product_id
    const order_id = +req.body.order_id

    if (!quantity) res.status(400).json({ error: 'Missing quantity' })
    if (!product_id) res.status(400).json({ error: 'Missing product id' })
    if (!order_id) res.status(400).json({ error: 'Missing order id' })

    const product = await oStore.addProductToOrder({
      quantity,
      product_id,
      order_id
    })

    res.json({
      status: 'success',
      data: { ...product },
      message: 'Your product has been added successfully'
    })
  } catch (err) {
    res.status(400).json(400)
  }
}

const orderRoutes = Router()
orderRoutes.route('/').post(create).get(index)
orderRoutes.route('/:id').get(show).delete(deleteHandler).put(update)
orderRoutes.route('/add-product/:id').post(addProductToOrder)
orderRoutes.get('/current-orders/:id', dashboardQueries.getUserOrders)

export default orderRoutes
