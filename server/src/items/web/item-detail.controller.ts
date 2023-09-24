import { Controller, Get, Param } from '@nestjs/common'
import { ItemResponse } from '../dto/detail-item.dto'
import { ItemReader } from '../application/item.reader'

@Controller('items')
export class ItemDetailController {
  constructor(private readonly itemService: ItemReader) {}

  @Get(':id')
  async getItemHandler(@Param('id') id: number): Promise<ItemResponse> {
    const { itemName, itemDetail, price, stockNumber, itemSellStatus } = await this.itemService.getItem(id)

    return new ItemResponse({
      id: id,
      itemName: itemName,
      itemDetail: itemDetail,
      price: price,
      stockNumber: stockNumber,
      sellStatus: itemSellStatus,
    })
  }
}
