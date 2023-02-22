/* eslint-disable quotes */
import bcrypt from 'bcrypt'
import db from '../database'
import config from '../config'
import { User } from '../interfaces/user.interface'

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10)
  return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class UserModelStore {
  async create(user: User): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = `INSERT INTO users (email, first_name, last_name, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, email, first_name, last_name`

      const result = await conn.query(sql, [
        user.email,
        user.first_name,
        user.last_name,
        hashPassword(user.password)
      ])

      conn.release()

      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Unable to create user error: (${user.email} : ${(error as Error).message})`)
    }
  }

  async index(): Promise<User[]> {
    try {
      const conn = await db.connect()
      const sql = 'SELECT id, email, first_name, last_name FROM users'
      const result = await conn.query(sql)

      conn.release()
      return result.rows
    } catch (error: unknown) {
      throw new Error(`Could not get users : ${(error as Error).message}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = `SELECT id, email, first_name, last_name FROM users WHERE id = ($1)`
      const result = await conn.query(sql, [id])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not get user error : ${(error as Error).message}`)
    }
  }

  async update(u: User): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = `UPDATE users
      SET first_name = ($1), last_name = ($2)
      WHERE id = ($3) 
      RETURNING first_name, last_name`
      const result = await conn.query(sql, [u.first_name, u.last_name, u.id])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not update user error : ${(error as Error).message}`)
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const conn = await db.connect()
      const sql = `DELETE FROM users WHERE id = ($1)`
      const result = await conn.query(sql, [id])

      conn.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Unable to delete user error : ${(error as Error).message}`)
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const conn = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT password FROM users WHERE email = ($1)`
      const result = await conn.query(sql, [email])

      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0]
        const isPasswordValid = bcrypt.compareSync(`${password}${config.pepper}`, hashPassword)

        if (isPasswordValid) {
          const userInfo = await conn.query(
            // eslint-disable-next-line quotes
            `SELECT id, email, first_name, last_name FROM users WHERE email = ($1)`,
            [email]
          )

          conn.release()
          return userInfo.rows[0]
        }
      }

      conn.release()
      return null
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`)
    }
  }
}

export default UserModelStore
