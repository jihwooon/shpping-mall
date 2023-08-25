import Product from './product.entity'
import { CreateProductDTO } from './dto/createProduct.dto'
import { ProductService } from './product.service'
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  InternalServerErrorException,
} from '@nestjs/common'

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get(':productId')
  async getProductHandler(
    @Param('productId') id: string,
  ): Promise<Product | undefined> {
    const result = await this.productService.getProduct(
      Number(id),
    )
    return result
  }

  @Post()
  async createProductHandler(
    @Body() request: CreateProductDTO,
  ) {
    await this.productService.createProduct(
      new Product({
        categoryId: request.categoryId,
      }),
    )
    return {
      success: true,
      message: 'Product success',
    }
  }
}
