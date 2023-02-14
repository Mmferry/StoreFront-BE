import { Response, Request, NextFunction, Application } from 'express'
import ProductModelStore from '../models/product.model'

const pStore = new ProductModelStore()

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await pStore.create(req.body)

    res.json({
      status: 'success',
      data: { ...product },
      message: 'Product added successfully'
    })
  } catch (err) {
    next(err)
  }
}

const index = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await pStore.index()

    res.json({
      status: 'success',
      data: products,
      message: 'products retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await pStore.show(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: product,
      message: 'Product retrieved successfully'
    })
  } catch (err) {
    next(err)
  }
}

const productRoutes = (app: Application) => {
  app.post('/', create)
  app.get('/', index)
  app.get('/:id', show)
}

export default productRoutes
