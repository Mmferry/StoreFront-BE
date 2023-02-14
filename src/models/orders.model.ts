import db from '../database'

type Order = {
  id?: number
  quantity: number
  product_id: number
  user_id: number
  status: string
}

class OrderModelStore {
  async addProduct(
    quantity: number,
    productId: string,
    userId: string,
    status: string
  ): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (quantity, product_id, user_id, status) VALUES($1, $2, $3, $4) RETURNING *'
      const conn = await db.connect()

      const result = await conn.query(sql, [quantity, productId, userId, status])

      const order = result.rows[0]

      conn.release()

      return order
    } catch (err) {
      throw new Error(`Could not add product ${productId} : ${err}`)
    }
  }
}

export default OrderModelStore
