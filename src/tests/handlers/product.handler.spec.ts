import supertest from 'supertest'
import { createToken } from './../../auth/authentication'
import { Product } from '../../interfaces/product.interface'
import app from '../../server'
import { User } from '../../interfaces/user.interface'

const request = supertest(app)

describe('Product APIs: ', () => {
  const user: User = {
    first_name: 'Mohammed',
    last_name: 'Rezk',
    email: 'mfaired@gmail.com',
    password: 'pass123'
  }

  const token = `bearer ${createToken(user)}`

  let product: Product = {
    name: 'DAIRY MILK',
    price: 10,
    category: 'sweets'
  }

  const getAll = async () => {
    const res = await request.get('/api/product').set('Authorization', token)

    return res
  }

  const deleteProd = async (id: string): Promise<number> => {
    const res = await request.delete(`/api/product/${id}`).set('Authorization', token)

    return res.status
  }

  const createProduct = async (product: Product) => {
    const res = await request.post('/api/product').send(product).set('Authorization', token)

    return res
  }

  it('/api/product create product', async () => {
    const res = await createProduct(product)

    product = { ...product, ...res.body.data }

    expect(res.status).toEqual(200)
  })

  it('/api/product get all products', async () => {
    const res = await getAll()

    expect(res.status).toEqual(200)
  })

  it('/api/product/:id show product', async () => {
    const res = await (
      await request.get(`/api/product/${product.id}`).set('Authorization', token)
    ).body.data

    expect(res.price).toEqual(10)
  })

  it('/api/product/:id update product', async () => {
    const newProd = await request
      .put(`/api/product/${product.id}`)
      .send({ name: 'Dairy milk', price: 7, id: product.id })
      .set('Authorization', token)

    expect(newProd.body.data.price).toEqual(7)
  })

  it('/api/product/:id delete product by id', async () => {
    expect(await deleteProd(product.id as unknown as string)).toEqual(200)
  })
})
