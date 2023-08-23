import Product from './product.entity'
import { product } from '../fixture/productFixture'

describe('Product', () => {
  const products = new Product(product)

  it('객체가 동일한 경우 리턴한다', () => {
    expect(products.productId).toBe(product.productId)
  })
})
