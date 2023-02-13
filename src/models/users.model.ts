import bcrypt from 'bcrypt'
import db from '../database'
import config from '../config'

type User = {
  id?: number
  first_name: string
  last_name: string
  email: string
  password: string
}

const hashPassword = (password: string) => {
  const salt = parseInt(config.salt as string, 10)
  return bcrypt.hashSync(`${password}${config.pepper}`, salt)
}

class UserModelStore {
  async create(user: User): Promise<User> {
    try {
      const connection = await db.connect()
      const sql = `INSERT INTO users (email, first_name, last_name, password) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, email, first_name, last_name`

      const result = await connection.query(sql, [
        user.email,
        user.first_name,
        user.last_name,
        hashPassword(user.password)
      ])

      connection.release()

      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Unable to create with this (${user.email} : ${(error as Error).message})`)
    }
  }

  async index(): Promise<User[]> {
    try {
      const connection = await db.connect()
      const sql = 'SELECT id, email, first_name, last_name FROM users'
      const result = await connection.query(sql)

      connection.release()
      return result.rows
    } catch (error: unknown) {
      throw new Error(`Could not get users : ${(error as Error).message}`)
    }
  }

  async show(id: string): Promise<User> {
    try {
      const connection = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT id, email, first_name, last_name FROM users WHERE id = ($1)`
      const result = await connection.query(sql, [id])

      connection.release()
      return result.rows[0]
    } catch (error: unknown) {
      throw new Error(`Could not get user error : ${(error as Error).message}`)
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect()
      // eslint-disable-next-line quotes
      const sql = `SELECT password FROM users WHERE email = ($1)`
      const result = await connection.query(sql, [email])

      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0]
        const isPasswordValid = bcrypt.compareSync(`${password}${config.pepper}`, hashPassword)

        if (isPasswordValid) {
          const userInfo = await connection.query(
            // eslint-disable-next-line quotes
            `SELECT id, email, first_name, last_name FROM users WHERE email = ($1)`,
            [email]
          )
          return userInfo.rows[0]
        }
      }

      connection.release()
      return null
    } catch (error) {
      throw new Error(`Unable to login: ${(error as Error).message}`)
    }
  }
}

export default UserModelStore
