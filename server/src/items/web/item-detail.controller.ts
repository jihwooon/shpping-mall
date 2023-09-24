import { Controller, Get, Param } from '@nestjs/common'
import { ItemResponse } from '../dto/detail-item.dto'
import { ItemReader } from '../application/item.reader'

@Controller('items')
export class ItemDetailController {
  constructor(private readonly itemService: ItemReader) {}

  @Get(':id')
  async getItemHandler(@Param('id') id: number): Promise<ItemResponse> {
    const response = await this.itemService.getItem(id)

    return new ItemResponse({
      id: response.id,
      itemName: response.itemName,
      itemDetail: response.itemDetail,
      price: response.price,
      stockNumber: response.stockNumber,
      sellStatus: response.itemSellStatus,
    })
  }
}
