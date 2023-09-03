import { Item } from '../domain/item.entity'
import { ItemInfoRequest } from '../dto/itemInfoRequest.dto'
import { ItemService } from '../application/item.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('items')
export class ItemCreateController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItemHandler(@Body() request: ItemInfoRequest): Promise<void> {
    await this.itemService.registerItem(
      new Item({
        id: request.id,
        itemName: request.itemName,
        itemDetail: request.itemDetail,
        price: request.price,
        stockNumber: request.stockNumber,
        sellStatus: request.sellStatus,
      }),
    )
  }
}
