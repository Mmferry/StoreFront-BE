import { Response, Request, NextFunction, Application } from 'express'
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
    next(err)
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
    next(err)
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
    next(err)
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    const user = await uStore.authenticate(email, password)
    const token = jwt.sign({ user }, config.tokenSecret as string)
    console.log(token)

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The password and email do not match please try again'
      })
    }

    if (user) {
      return res.status(200).json({
        status: 'Success',
        data: { token: token },
        message: 'User authenticated successfully'
      })
    }
  } catch (err) {
    next(err)
  }
}

const usersRoutes = (app: Application) => {
  app.post('/', create)
  app.get('/', validateToken, index)
  app.get('/:id', validateToken, show)
  app.post('/login', authenticate)
}

export default usersRoutes
