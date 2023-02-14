import { Response, Request, NextFunction, Router } from 'express'
import jwt from 'jsonwebtoken'
import config from '../config'
import validateToken from '../middleware/auth.middleware'
import UserModelStore from '../models/user.model'

const uStore = new UserModelStore()

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await uStore.create(req.body)

    res.json({
      status: 'success',
      data: { ...user },
      message: 'User created successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await uStore.index()

    res.json({
      status: 'success',
      data: users,
      message: 'Users retrieved successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await uStore.show(req.params.id as unknown as string)

    res.json({
      status: 'success',
      data: user,
      message: 'User retrieved successfully'
    })
  } catch (err) {
    res.status(400).json(err)
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await uStore.authenticate(email, password)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The password and email do not match please try again'
      })
    }

    const token = jwt.sign({ user }, config.tokenSecret as string)

    if (user) {
      return res.status(200).json({
        status: 'Success',
        data: { token: token },
        message: 'User authenticated successfully'
      })
    }
  } catch (err) {
    res.status(400).json(err)
  }
}

const usersRoutes = Router()

usersRoutes.route('/').get(validateToken, index).post(create)
usersRoutes.get('/:id', validateToken, show)
usersRoutes.post('/login', authenticate)

export default usersRoutes
