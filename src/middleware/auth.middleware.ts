import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import getUserId from '../utils/auth.utils'

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization
    const token = auth && auth.split(' ')[1]

    jwt.verify(token!, config.tokenSecret as string)
    next()
  } catch (err) {
    res.status(401).json('Access denied, invalid token')
  }
}

export default validateToken
