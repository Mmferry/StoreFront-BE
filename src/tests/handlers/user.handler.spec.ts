import supertest from 'supertest'
import { User } from '../../interfaces/user.interface'
import app from '../../server'

const request = supertest(app)

describe('User APIs: ', () => {
  const baseUser: User = {
    first_name: 'Mohammed',
    last_name: 'Rezk',
    email: 'mfaired@gmail.com',
    password: 'pass123'
  }

  let user: User

  let token: string

  const getAll = async () => {
    return await request.get('/api/users').set('Authorization', token)
  }

  const deleteUser = async (id: string): Promise<number> => {
    const res = await request.delete(`/api/users/${id}`).set('Authorization', token)

    return res.status
  }

  const createUser = async (user: User) => {
    return await request.post('/api/users').send(user)
  }

  beforeAll(async () => {
    user = await (await createUser(baseUser)).body.data

    const res = await request.post('/api/users/authenticate').send({
      email: baseUser.email,
      password: baseUser.password
    })

    token = `bearer ${res.body.data.token}`
  })

  it('/api/users get all users', async () => {
    const res = await getAll()

    expect(res.status).toEqual(200)
  })

  it('/api/users/:id show users', async () => {
    const res = (await request.get(`/api/users/${user.id}`).set('Authorization', token)).body.data

    expect(res.email).toEqual('mfaired@gmail.com')
  })

  it('/api/users/:id update user', async () => {
    const createdUser = {
      first_name: 'Ahmed',
      last_name: 'Khaled',
      id: user.id
    }

    const updatedUser = await request
      .put(`/api/users/${user.id}`)
      .send(createdUser)
      .set('Authorization', token)

    expect(updatedUser.body.data.first_name).toEqual('Ahmed')
  })

  it('/api/users/:id delete user by id', async () => {
    const deletedUser = await deleteUser(user.id as unknown as string)

    expect(deletedUser).toEqual(200)
  })
})
