import { Controller, Patch, Param, Body } from '@nestjs/common'
import { ItemUpdater } from '../application/item.updater'
import { UpdateItemRequest } from '../dto/update-item.dto'
import { Item } from '../domain/item.entity'

@Controller('items')
export class ItemUpdateController {
  constructor(private readonly itemService: ItemUpdater) {}

  @Patch(':id')
  async updateItemHandler(@Param('id') id: number, @Body() request: UpdateItemRequest): Promise<boolean> {
    const { itemName, itemDetail, price, stockNumber, sellStatus } = request

    return await this.itemService.updateItem(
      id,
      new Item({
        itemName: itemName,
        itemDetail: itemDetail,
        price: price,
        stockNumber: stockNumber,
        sellStatus: sellStatus,
      }),
    )
  }
}
