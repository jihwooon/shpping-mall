import { Injectable } from '@nestjs/common'
import Product from './product.entity'
import ProductRepository from './product.repository'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async CreateProduct(product: Product): Promise<void> {
    await this.productRepository.save(product)
  }

  async getProduct(id: number) {
    await this.productRepository.findById(id)
  }

  getProducts(): Promise<Product[]> {
    const productList = this.productRepository.findAll()
    return productList
  }
}
