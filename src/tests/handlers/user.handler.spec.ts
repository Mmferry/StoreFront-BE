import supertest from 'supertest'
import { createToken } from './../../auth/authentication'
import { User } from '../../interfaces/user.interface'
import app from '../../server'

const request = supertest(app)

describe('User APIs: ', () => {
  const user: User = {
    first_name: 'Mohammed',
    last_name: 'Rezk',
    email: 'mfaired@gmail.com',
    password: 'pass123'
  }

  const token = `bearer ${createToken(user)}`

  const getAll = async () => {
    const res = await request.get('/api/users').set('Authorization', token)

    return res
  }

  const deleteUser = async (id: string): Promise<number> => {
    const res = await request.delete(`/api/users/${id}`).set('Authorization', token)

    return res.status
  }

  it('/api/users create user', async () => {
    const res = await request.post('/api/users').send(user)

    expect(res.status).toEqual(200)

    await deleteUser(res.body.data.id)
  })

  it('/api/users get all users', async () => {
    const res = await getAll()

    expect(res.status).toEqual(200)
  })

  it('/api/users/:id update user', async () => {
    const uRes = await request.post('/api/users').send(user)

    const createdUser = {
      first_name: 'Ibrahim',
      last_name: 'Mohsen',
      id: uRes.body.data.id
    }

    const updatedUser = await request
      .put(`/api/users/${uRes.body.data.id}`)
      .send(createdUser)
      .set('Authorization', token)

    expect(updatedUser.body.data.first_name).toEqual('Ibrahim')

    await deleteUser(updatedUser.body.data.id)
  })

  it('/api/users/:id delete user by id', async () => {
    const createdUser = await request.post('/api/users').send(user)

    const deletedUser = await deleteUser(createdUser.body.data.id)

    expect(deletedUser).toEqual(200)
  })
})
