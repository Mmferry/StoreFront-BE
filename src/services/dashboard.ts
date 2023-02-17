import db from '../database'
import { Order } from '../models/orders.model'

class DashboardQueries {
  async getUserOrders(userId: string): Promise<Order> {
    try {
      const conn = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT * FROM orders WHERE user_id = ($1)`
      const result = await conn.query(sql, [userId])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not get order with this ${userId} error : ${(error as Error).message}`)
    }
  }

  async getCompletedUserOrders(userId: string): Promise<Order> {
    try {
      const conn = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT * FROM orders WHERE user_id = ($1) AND status = 'complete'`
      const result = await conn.query(sql, [userId])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not get order with this ${userId} error : ${(error as Error).message}`)
    }
  }
}

export default DashboardQueries
