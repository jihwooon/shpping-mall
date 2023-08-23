import { Injectable } from '@nestjs/common'
import Product from './product.entity'
import ProductRepository from './product.repository'
import { UpdateProductDTO } from './dto/updateProduct.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async createProduct(product: Product): Promise<boolean> {
    const products = await this.productRepository.save(
      product,
    )
    return products
  }

  async getProduct(
    id: number,
  ): Promise<Product | undefined> {
    const product = await this.productRepository.findById(
      id,
    )
    return product
  }

  async getProducts(): Promise<Product[]> {
    const productList =
      await this.productRepository.findAll()
    return productList
  }

  async updateProduct(
    id: number,
    updateProduct: UpdateProductDTO,
  ): Promise<boolean> {
    const product = new Product({
      productName: updateProduct.content,
      imageUrl: updateProduct.imageURL,
    })

    return await this.productRepository.update(id, product)
  }
}
