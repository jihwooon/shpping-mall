import { Item } from '../domain/item.entity'
import { CreateItemRequest, CreateItemResponse } from '../dto/save-item.dto'
import { ItemCreater } from '../application/item.creater'
import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../config/auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../config/auth/guards/role-auth.guard'
import { Roles } from '../../config/auth/role.decorator'
import { Role } from '../../members/domain/member-role.enum'

@Controller('items')
export class ItemCreateController {
  constructor(private readonly itemService: ItemCreater) {}

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createItemHandler(@Body() dto: CreateItemRequest, @Req() req: any): Promise<CreateItemResponse> {
    const { itemName, itemDetail, price, stockNumber, sellStatus } = dto
    const { email } = req?.user

    const id = await this.itemService.registerItem(
      new Item({
        itemName: itemName,
        itemDetail: itemDetail,
        price: price,
        stockNumber: stockNumber,
        sellStatus: sellStatus,
      }),
      email,
    )

    return {
      id: id,
    }
  }
}
