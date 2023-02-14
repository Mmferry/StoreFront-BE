import { Request } from 'express'
import jwt from 'jsonwebtoken'

const getUserId = (req: Request): string => {
  try {
    const auth = req.headers.authorization
    const token = auth && auth.split(' ')[1]

    const { user }: any = token && (jwt.decode(token) as jwt.JwtPayload)

    return user.id
  } catch (err) {
    throw new Error('token invalid')
  }
}

export default getUserId
