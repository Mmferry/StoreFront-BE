import { Response, Request, Router } from 'express'
import ProductModelStore from '../models/product.model'

const pStore = new ProductModelStore()

const create = async (req: Request, res: Response) => {
  try {
    const product = await pStore.create(req.body)

    res.json({
      status: 'success',
      data: { ...product },
      message: 'Product added successfully'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const index = async (_req: Request, res: Response) => {
  try {
    const products = await pStore.index()

    res.json({
      status: 'success',
      data: products,
      message: 'products retrieved successfully'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const show = async (req: Request, res: Response) => {
  try {
    const product = await pStore.show(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: product,
      message: 'Product retrieved successfully'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const product = await pStore.update(req.body)

    res.json({
      status: 'success',
      data: product,
      message: 'product updated successfully'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

export const deleteHandler = async (req: Request, res: Response) => {
  try {
    const product = await pStore.delete(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: product,
      message: 'product deleted successfully'
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

const productRoutes = Router()
productRoutes.route('/').post(create).get(index)
productRoutes.route('/:id').get(show).delete(deleteHandler).put(update)

export default productRoutes
