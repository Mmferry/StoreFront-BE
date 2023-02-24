import jwt from 'jsonwebtoken'
import config from '../config'
import { User } from '../interfaces/user.interface'

export const createToken = (user: User): string => {
  return jwt.sign({ user }, config.tokenSecret as string)
}
