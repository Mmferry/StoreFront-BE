import { User } from '../../interfaces/user.interface'
import UserModelStore from '../../models/user.model'

const uStore = new UserModelStore()

describe('User model test', () => {
  let initiateUser: User

  const user: User = {
    first_name: 'Mohammed',
    last_name: 'Fared',
    email: 'mo@test.com',
    password: '1234mo'
  }

  const deleteUser = async (id: string) => {
    await uStore.delete(id)
  }

  beforeEach(async () => {
    initiateUser = await uStore.create(user)
  })

  afterEach(async () => {
    await deleteUser(initiateUser.id as unknown as string)
  })

  it('Should create user', async () => {
    await deleteUser(initiateUser.id as unknown as string)

    const createdUser = await uStore.create(user)
    expect(createdUser.first_name).toBe(initiateUser.first_name)
    expect(createdUser.last_name).toBe(initiateUser.last_name)
    expect(createdUser.email).toBe(initiateUser.email)

    await deleteUser(createdUser.id as unknown as string)
  })

  it('Should return the user by Id', async () => {
    const result = await uStore.show(initiateUser.id as unknown as string)

    expect(result.first_name).toBe(initiateUser.first_name)
    expect(result.last_name).toBe(initiateUser.last_name)
    expect(result.email).toBe(initiateUser.email)
  })

  it('index method should return a list of users', async () => {
    const result = await uStore.index()

    expect(result[0].first_name).toBe(initiateUser.first_name)
    expect(result[0].last_name).toBe(initiateUser.last_name)
    expect(result[0].email).toBe(initiateUser.email)
  })

  it('Should remove the user by id', async () => {
    await deleteUser(initiateUser.id as unknown as string)

    const result = await uStore.index()
    expect(result.length).toBe(0)
  })

  it('Should update the user', async () => {
    const updatedUser = {
      id: initiateUser.id,
      first_name: 'Ahmed',
      last_name: 'Rezk'
    }

    const result = await uStore.update(updatedUser as unknown as User)

    expect(result.first_name).toEqual(updatedUser.first_name)
    expect(result.last_name).toEqual(updatedUser.last_name)
  })
})
