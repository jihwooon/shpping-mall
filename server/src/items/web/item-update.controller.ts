import { Controller, Patch, Param, Body } from '@nestjs/common'
import { ItemUpdater } from '../application/item.updater'
import { UpdateItemInfoRequest } from '../dto/item-update.request.dto'
import { Item } from '../domain/item.entity'

@Controller('items')
export class ItemUpdateController {
  constructor(private readonly itemService: ItemUpdater) {}

  @Patch(':id')
  async updateItemHandler(@Param('id') id: number, @Body() request: UpdateItemInfoRequest): Promise<boolean> {
    const response = await this.itemService.updateItem(
      id,
      new Item({
        itemName: request.itemName,
        itemDetail: request.itemDetail,
        price: request.price,
        stockNumber: request.stockNumber,
        sellStatus: request.sellStatus,
      }),
    )

    return response
  }
}
