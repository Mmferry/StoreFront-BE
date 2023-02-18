import UserModelStore from '../../models/user.model'
import OrderModelStore from '../../models/orders.model'
import ProductModelStore from '../../models/product.model'
import { Order, ProductToOrder } from '../../interfaces/order.interface'
import { User } from '../../interfaces/user.interface'
import { Product } from '../../interfaces/product.interface'

const oStore = new OrderModelStore()
const pStore = new ProductModelStore()
const uStore = new UserModelStore()

describe('Orders model test', () => {
  let originalTimeout: number

  beforeEach(function () {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000
  })

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  let productId: number
  let userId: number
  let order: Order = { status: 'active' } as Order

  beforeAll(async () => {
    const user: User = await uStore.create({
      first_name: 'Mohammed',
      last_name: 'Fared',
      email: 'mo@test.com',
      password: '1234mo'
    })

    userId = user.id!

    const product: Product = await pStore.create({
      name: 'Lucker',
      price: 15,
      category: 'food'
    })

    productId = product.id!

    order = { ...order, user_id: userId }
  })

  it('Should create order', async () => {
    const result = await oStore.create(order)

    expect(result.status).toEqual(order.status)
    expect(result.user_id).toEqual(order.user_id)

    const productRes: ProductToOrder = await oStore.addProductToOrder({
      order_id: result.id!,
      product_id: productId,
      quantity: 3
    })

    expect(productRes.order_id).toBe(productRes.order_id)
    expect(productRes.product_id).toBe(productRes.product_id)
    expect(productRes.quantity).toBe(productRes.quantity)
  })

  it('Should return the order by id', async () => {
    const createdOrder = await oStore.create(order)
    const result = await oStore.show(createdOrder.id as unknown as string)

    expect(result.status).toEqual(order.status)
    expect(result.user_id).toEqual(order.user_id)
  })

  it('Should get all orders', async () => {
    const result = await oStore.index()

    expect(result[0].status).toEqual(order.status)
    expect(result[0].user_id).toEqual(order.user_id)
  })

  it('Should update order status', async () => {
    const newOrder = await oStore.create(order)

    const result = await oStore.update({ status: 'completed', id: newOrder.id } as Order)

    expect(result.status).toEqual('completed')
  })

  it('Should remove the order by id', async () => {
    const newOrder = await oStore.create(order)

    await oStore.addProductToOrder({
      order_id: newOrder.id!,
      product_id: productId,
      quantity: 3
    })

    const result = await oStore.delete(newOrder.id as unknown as string)

    expect(result).toEqual([] as unknown as Order)
  })
})
