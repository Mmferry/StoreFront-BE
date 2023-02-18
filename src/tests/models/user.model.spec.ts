import { User } from '../../interfaces/user.interface'
import UserModelStore from '../../models/user.model'

const uStore = new UserModelStore()

describe('User model test', () => {
  let initCreatedUser: User

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
    initCreatedUser = await uStore.create(user)
  })

  afterEach(async () => {
    await deleteUser(initCreatedUser.id as unknown as string)
  })

  it('Should have index method', () => {
    expect(uStore.index).toBeDefined()
  })

  it('Should have create method', () => {
    expect(uStore.create).toBeDefined()
  })

  it('Should have show method', () => {
    expect(uStore.show).toBeDefined()
  })

  it('Should have update method', () => {
    expect(uStore.update).toBeDefined()
  })

  it('Should have delete method', () => {
    expect(uStore.delete).toBeDefined()
  })

  it('Should create user', async () => {
    await deleteUser(initCreatedUser.id as unknown as string)

    const createdUser = await uStore.create(user)
    expect(createdUser.first_name).toBe('Mohammed')
    expect(createdUser.last_name).toBe('Fared')
    expect(createdUser.email).toBe('mo@test.com')

    await deleteUser(createdUser.id as unknown as string)
  })

  it('Should return the user by Id', async () => {
    expect(initCreatedUser.first_name).toBe('Mohammed')
    expect(initCreatedUser.last_name).toBe('Fared')
    expect(initCreatedUser.email).toBe('mo@test.com')
  })

  it('index method should return a list of users', async () => {
    const result = await uStore.index()
    expect(result[0].first_name).toBe('Mohammed')
    expect(result[0].last_name).toBe('Fared')
    expect(result[0].email).toBe('mo@test.com')
  })
})
