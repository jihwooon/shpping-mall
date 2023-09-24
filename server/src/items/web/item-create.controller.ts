import { Item } from '../domain/item.entity'
import { CreateItemRequest } from '../dto/save-item.dto'
import { ItemCreater } from '../application/item.creater'
import { Body, Controller, Post, HttpCode } from '@nestjs/common'

@Controller('items')
export class ItemCreateController {
  constructor(private readonly itemService: ItemCreater) {}

  @Post()
  @HttpCode(204)
  async createItemHandler(@Body() request: CreateItemRequest): Promise<void> {
    await this.itemService.registerItem(
      new Item({
        itemName: request.itemName,
        itemDetail: request.itemDetail,
        price: request.price,
        stockNumber: request.stockNumber,
        sellStatus: request.sellStatus,
      }),
    )
  }
}
