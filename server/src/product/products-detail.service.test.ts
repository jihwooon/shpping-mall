import { Test } from '@nestjs/testing'

import { ProductService } from './products-detail.service'
import Product from './entity/product.entity'

describe('ProductService', () => {
  let productService: ProductService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProductService],
    }).compile()

    productService =
      module.get<ProductService>(ProductService)
  })

  const mockProduct = new Product({
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

  context('getProduct', () => {
    it('', () => {
      const product = productService.getProduct()

      expect(product).toEqual(mockProduct)
    })
  })
})
