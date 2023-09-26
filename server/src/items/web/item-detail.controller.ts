import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ItemResponse } from '../dto/detail-item.dto'
import { ItemReader } from '../application/item.reader'
import { JwtAuthGuard } from '../../config/auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../config/auth/guards/role-auth.guard'
import { Roles } from '../../config/auth/role.decorator'
import { Role } from '../../members/domain/member-role.enum'

@Controller('items')
export class ItemDetailController {
  constructor(private readonly itemService: ItemReader) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
