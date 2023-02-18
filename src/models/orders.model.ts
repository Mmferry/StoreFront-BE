/* eslint-disable quotes */
import db from '../database'
import { Order, ProductToOrder } from '../interfaces/order.interface'

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
      const sql = `SELECT * FROM orders WHERE id = ($1)`
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

  async update(o: Order): Promise<Order> {
    try {
      const conn = await db.connect()
      const sql = `UPDATE order
      SET status = $1
      WHERE id = ($2) 
      RETURNING status`
      const result = await conn.query(sql, [o.status, o.id])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not update order status error : ${(error as Error).message}`)
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const conn = await db.connect()
      const productSql = `DELETE FROM order_products WHERE order_id=($1)`
      await conn.query(productSql, [id])

      const orderSql = `DELETE FROM orders WHERE id = ($1)`
      const result = await conn.query(orderSql, [id])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Unable to delete order error : ${(error as Error).message}`)
    }
  }

  async addProductToOrder(PTO: ProductToOrder): Promise<ProductToOrder> {
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
