import Product from './product.entity'
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
  async createProductHandler(@Body() product: Product) {
    const result = await this.productService.createProduct(
      product,
    )

    if (!result) {
      throw new InternalServerErrorException()  
    }
    
    return {
      success: true,
      message: 'Product success',
    }
  }
}
