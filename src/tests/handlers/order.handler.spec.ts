import supertest from 'supertest'
import app from '../../server'
import { createToken } from './../../auth/authentication'
import { Order } from '../../interfaces/order.interface'
import { User } from '../../interfaces/user.interface'
import { Product } from '../../interfaces/product.interface'

const request = supertest(app)

describe('Product APIs: ', () => {
  let user: User = {
    first_name: 'Mohammed',
    last_name: 'Rezk',
    email: 'mfaired@gmail.com',
    password: 'pass123'
  }

  let token: string

  let product: Product = {
    name: 'DAIRY MILK',
    price: 10,
    category: 'sweets'
  }

  const getAll = async () => {
    const res = await request.get('/api/order').set('Authorization', token)

    return res
  }

  const deleteOrder = async (id: string): Promise<number> => {
    const res = await request.delete(`/api/order/${id}`).set('Authorization', token)

    return res.status
  }

  const createProduct = async (product: Product) => {
    const res = await request.post('/api/product').send(product).set('Authorization', token)

    return res.body.data
  }

  beforeAll(async () => {
    const initiateUser = await request.post('/api/users').send(user)

    user = { ...user, ...initiateUser.body.data }

    const res = await request.post('/api/users/authenticate').send({
      email: user.email,
      password: user.password
    })

    token = `bearer ${res.body.data.token}`
  })

  afterAll(async () => {
    await request.delete(`/api/users/${user.id}`).set('Authorization', token)
    await request.delete(`/api/product/${product.id}`).set('Authorization', token)
    // await request.delete(`/api/users/${user.id}`)
  })

  let orderId: string

  it('/api/order create order', async () => {
    const order: Order = {
      user_id: user.id!,
      status: 'active'
    }

    const res = await request.post('/api/order').send(order).set('Authorization', token)

    orderId = res.body.data.id

    expect(res.status).toEqual(200)
  })

  it('/api/order get all orders', async () => {
    const res = await getAll()

    expect(res.status).toEqual(200)
  })

  it('/api/order/:id show order', async () => {
    const res = await (
      await request.get(`/api/order/${orderId}`).set('Authorization', token)
    ).body.data

    expect(res.status).toEqual('active')
  })

  it('/api/order/id update order', async () => {
    const newOrder = await request
      .put(`/api/order/id=${orderId}`)
      .send({
        status: 'completed',
        id: orderId
      })
      .set('Authorization', token)

    expect(newOrder.body.data.status).toEqual('completed')
  })

  it('/api/add-product/:id add product to order', async () => {
    const newProd = await createProduct(product)

    product = { ...product, ...newProd }

    const res = await request
      .post(`/api/order/add-product/${orderId}`)
      .send({
        quantity: 2,
        product_id: product.id,
        order_id: orderId
      })
      .set('Authorization', token)

    expect(res.status).toEqual(200)

    await request.delete(`/api/users/${user.id}`).set('Authorization', token)
  })

  it('/api/order/:id delete order by id', async () => {
    expect(await deleteOrder(orderId as unknown as string)).toEqual(200)
  })
})
