import { Item } from '../domain/item.entity'
import { CreateItemRequest, CreateItemResponse } from '../dto/save-item.dto'
import { ItemCreater } from '../application/item.creater'
import { Body, Controller, Post, HttpCode } from '@nestjs/common'

@Controller('items')
export class ItemCreateController {
  constructor(private readonly itemService: ItemCreater) {}

  @Post()
  @HttpCode(201)
  async createItemHandler(@Body() request: CreateItemRequest): Promise<CreateItemResponse> {
    const { itemName, itemDetail, price, stockNumber, sellStatus } = request

    const id = await this.itemService.registerItem(
      new Item({
        itemName: itemName,
        itemDetail: itemDetail,
        price: price,
        stockNumber: stockNumber,
        sellStatus: sellStatus,
      }),
    )

    return {
      id: id,
    }
  }
}
