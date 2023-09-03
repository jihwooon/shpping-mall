import { ItemService } from '../application/item.service'
import { Controller, Get, Param } from '@nestjs/common'
import { ItemInfoResponse } from '../dto/itemInfoResponse.dto'

@Controller('items')
export class ItemDetailController {
  constructor(private readonly itemService: ItemService) {}

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
