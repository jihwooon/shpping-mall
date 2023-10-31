import { Body, Controller, Param, Patch, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { ItemUpdater } from '../application/item.updater'
import { UpdateItemRequest } from '../dto/update-item.dto'
import { Item } from '../domain/item.entity'
import { FilesInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../../config/auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../config/auth/guards/role-auth.guard'
import { Roles } from '../../config/auth/role.decorator'
import { Role } from '../../members/domain/member-role.enum'
import { multerDiskOptions } from '../../config/multer/multer.options'

@Controller('items')
export class ItemUpdateController {
  constructor(private readonly itemService: ItemUpdater) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FilesInterceptor('files', null, multerDiskOptions))
  async updateItemHandler(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
    @Body() dto: UpdateItemRequest,
  ): Promise<boolean> {
    const { itemName, itemDetail, price, stockNumber, sellStatus } = dto
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
      files,
    )
  }
}
