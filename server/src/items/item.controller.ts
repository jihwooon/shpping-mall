import { Item } from './item.entity'
import { ItemInfoDTO } from './dto/itemInfoDTO'
import { ItemService } from './item.service'
import { Body, Controller, Post, Get, Param } from '@nestjs/common'

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  async createItemHandler(@Body() request: ItemInfoDTO): Promise<void> {
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

  @Get(':id')
  async getItemHandler(@Param('id') id: number): Promise<Item> {
    return await this.itemService.getItem(id)
  }
}
