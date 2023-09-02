import { Item } from './item.entity'
import { ItemInfoDTO } from './dto/itemInfoDTO'
import { ItemService } from './item.service'
import { Body, Controller, Post } from '@nestjs/common'

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItemHandler(@Body() request: ItemInfoDTO): Promise<void> {
    await this.itemService.registerItem(
      new Item({
        id: request.id,
        itemName: request.name,
        itemDetail: request.detail,
        price: request.price,
        stockNumber: request.stockNumber,
        itemSellStatus: request.sellStatus,
      }),
    )
  }
}
