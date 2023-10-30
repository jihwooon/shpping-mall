import { Controller, Patch, Param, Body, UseGuards, Req } from '@nestjs/common'
import { ItemUpdater } from '../application/item.updater'
import { UpdateItemRequest } from '../dto/update-item.dto'
import { Item } from '../domain/item.entity'
import { JwtAuthGuard } from '../../config/auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../config/auth/guards/role-auth.guard'
import { Roles } from '../../config/auth/role.decorator'
import { Role } from '../../members/domain/member-role.enum'

@Controller('items')
export class ItemUpdateController {
  constructor(private readonly itemService: ItemUpdater) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateItemHandler(
    @Param('id') id: string,
    @Req() req: any,
    @Body() request: UpdateItemRequest,
  ): Promise<boolean> {
    const { itemName, itemDetail, price, stockNumber, sellStatus } = request
    const { email } = req?.user

    return await this.itemService.updateItem(
      email,
      parseInt(id),
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
