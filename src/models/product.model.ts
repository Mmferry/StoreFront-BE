import db from '../database'
import { Product } from '../interfaces/product.interface'

class ProductModelStore {
  async create(product: Product): Promise<Product> {
    try {
      const connection = await db.connect()
      const sql = `INSERT INTO products (name, price, category) 
      VALUES ($1, $2, $3) 
      RETURNING *`

      const result = await connection.query(sql, [product.name, product.price, product.category])

      connection.release()

      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Unable to create product ${(error as Error).message}`)
    }
  }

  async index(): Promise<Product[]> {
    try {
      const connection = await db.connect()
      const sql = 'SELECT * FROM products'
      const result = await connection.query(sql)

      connection.release()
      return result.rows
    } catch (error: unknown) {
      throw new Error(`Could not load products : ${(error as Error).message}`)
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const connection = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT * FROM products WHERE id = ($1)`
      const result = await connection.query(sql, [id])

      connection.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not get product with this ${id} : ${(error as Error).message}`)
    }
  }
}

export default ProductModelStore
