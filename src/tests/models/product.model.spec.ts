import { Product } from '../../interfaces/product.interface'
import ProductModelStore from '../../models/product.model'

const pStore = new ProductModelStore()

describe('Product model test', () => {
  let initiateProduct: Product

  const product: Product = {
    name: 'Iphone 11 pro max',
    price: 5000,
    category: 'mobile'
  }

  const deleteProduct = async (id: string) => {
    await pStore.delete(id)
  }

  beforeEach(async () => {
    initiateProduct = await pStore.create(product)
  })

  afterEach(async () => {
    await deleteProduct(initiateProduct.id as unknown as string)
  })

  it('Should have index method', () => {
    expect(pStore.index).toBeDefined()
  })

  it('Should have create method', () => {
    expect(pStore.create).toBeDefined()
  })

  it('Should have show method', () => {
    expect(pStore.show).toBeDefined()
  })

  it('Should have update method', () => {
    expect(pStore.update).toBeDefined()
  })

  it('Should have delete method', () => {
    expect(pStore.delete).toBeDefined()
  })

  it('Should create product', async () => {
    await deleteProduct(initiateProduct.id as unknown as string)

    const createdProduct = await pStore.create(product)
    expect(createdProduct.name).toBe(initiateProduct.name)
    expect(createdProduct.price).toBe(initiateProduct.price)
    expect(createdProduct.category).toBe(initiateProduct.category)
  })

  it('Should return the product by Id', async () => {
    expect(initiateProduct.name).toBe(initiateProduct.name)
    expect(initiateProduct.price).toBe(initiateProduct.price)
    expect(initiateProduct.category).toBe(initiateProduct.category)
  })

  it('index method should return a list of products', async () => {
    const result = await pStore.index()
    expect(result[1].name).toBe(initiateProduct.name)
    expect(result[1].price).toBe(initiateProduct.price)
    expect(result[1].category).toBe(initiateProduct.category)
  })

  it('Should remove the product by id', async () => {
    await deleteProduct(initiateProduct.id as unknown as string)
    expect(initiateProduct.name).toBe(initiateProduct.name)
    expect(initiateProduct.price).toBe(initiateProduct.price)
  })

  it('Should update the product', async () => {
    const updatedProduct = {
      id: initiateProduct.id,
      name: 'Samsung Galaxy S3',
      price: 4500
    }

    const result = await pStore.update(updatedProduct as unknown as Product)

    expect(result.name).toEqual(updatedProduct.name)
    expect(result.price).toEqual(updatedProduct.price)
  })
})
