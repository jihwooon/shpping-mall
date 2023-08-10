import Product from './product.entity'

describe('Product', () => {
  const product = new Product({
    productId: 28260,
    categoryId: 1,
    productName: 'New Balance 530 Steel Grey',
    size: '220',
    recentPrice: 130000,
    buyPrice: 106000,
    sellPrice: 86000,
    productInfo: '1',
    imageUrl: 'www.xxx.com',
  })

  it('product 값을 반환한다.', () => {
    expect(product.productId).toBe(28260)
    expect(product.categoryId).toBe(1)
    expect(product.productName).toBe(
      'New Balance 530 Steel Grey',
    )
  })
})
