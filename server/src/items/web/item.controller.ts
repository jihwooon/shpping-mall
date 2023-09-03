import { Item } from '../domain/item.entity'
import { ItemInfoRequest } from '../dto/itemInfoRequest.dto'
import { ItemService } from '../application/item.service'
import { Body, Controller, Post, Get, Param } from '@nestjs/common'
import { ItemInfoResponse } from '../dto/itemInfoResponse.dto'

@Controller('items')
export class ItemController {
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

  @Get(':id')
  async getItemHandler(@Param('id') id: number): Promise<ItemInfoResponse> {
    const response = await this.itemService.getItem(id)

    return new ItemInfoResponse({
      id: response.id,
      itemName: response.itemName,
      itemDetail: response.itemDetail,
      price: response.price,
      stockNumber: response.stockNumber,
      sellStatus: response.itemSellStatus,
    })
  }
}
