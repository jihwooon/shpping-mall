import { Injectable } from '@nestjs/common'
import Product from './entity/product.entity'

@Injectable()
export class ProductService {
  getProduct(): Product {
    return new Product({
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
  }
}
