/* eslint-disable quotes */
import db from '../database'

export type Order = {
  id?: number
  user_id: number
  status: string
}

export type ProductToOrder = {
  id?: number
  order_id: number
  product_id: number
  quantity: number
}

class OrderModelStore {
  async index(): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders'
      const conn = await db.connect()

      const result = await conn.query(sql)

      const orders = result.rows

      return orders
    } catch (err) {
      throw new Error(`Could not load orders error ${(err as Error).message}`)
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = `SELECT * FROM orders WHERE id = $(1)`
      const conn = await db.connect()

      const result = await conn.query(sql, [id])

      const order = result.rows[0]

      return order
    } catch (err) {
      throw new Error(`Could not get order with id: ${id} error ${(err as Error).message}`)
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql = `INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *`
      const conn = await db.connect()

      const result = await conn.query(sql, [o.user_id, o.status])

      const order = result.rows[0]

      return order
    } catch (err) {
      throw new Error(`Unable to create order error ${(err as Error).message}`)
    }
  }

  async addProductToOrder(PTO: ProductToOrder): Promise<Order> {
    try {
      const sql =
        'INSERT INTO order_products (quantity, product_id, order_id) VALUES($1, $2, $3) RETURNING *'
      const conn = await db.connect()

      const result = await conn.query(sql, [PTO.quantity, PTO.product_id, PTO.order_id])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${PTO.product_id} : ${(err as Error).message}`)
    }
  }
}

export default OrderModelStore
