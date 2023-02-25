import supertest from 'supertest'
import { createToken } from './../../auth/authentication'
import { Product } from '../../interfaces/product.interface'
import app from '../../server'
import { User } from '../../interfaces/user.interface'

const request = supertest(app)

describe('Product APIs: ', () => {
  let token: string
  let user: User
  const baseUser: User = {
    first_name: 'Mohammed',
    last_name: 'Rezk',
    email: 'mfaired@gmail.com',
    password: 'pass123'
  }

  let product: Product = {
    name: 'DAIRY MILK',
    price: 10,
    category: 'sweets'
  }

  const getAll = async () => {
    return await request.get('/api/product').set('Authorization', token)
  }

  const deleteProd = async (id: string): Promise<number> => {
    const res = await request.delete(`/api/product/${id}`).set('Authorization', token)

    return res.status
  }

  const createProduct = async (product: Product) => {
    return await request.post('/api/product').send(product).set('Authorization', token)
  }

  beforeAll(async () => {
    user = await (await request.post('/api/users').send(baseUser)).body.data

    const res = await request.post('/api/users/authenticate').send({
      email: baseUser.email,
      password: baseUser.password
    })

    token = `bearer ${res.body.data.token}`
  })

  afterAll(async () => {
    await request.delete(`/api/users/${user.id}`).set('Authorization', token)
  })

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
