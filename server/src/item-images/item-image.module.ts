import { Module } from '@nestjs/common'
import { DatabaseModule } from '../config/database/database.module'
import { ItemImageCreater } from '../item-images/application/item-image.creater'
import { ItemImageRepository } from '../item-images/domain/item-image.repository'
import { ItemImageUpdater } from '../item-images/application/item-image.updater'
import { ItemRepository } from '../items/domain/item.repository'

@Module({
  imports: [DatabaseModule],
  providers: [ItemImageCreater, ItemImageRepository, ItemImageUpdater, ItemRepository],
  exports: [ItemImageCreater, ItemImageRepository, ItemImageUpdater, ItemRepository],
})
export class ItemImageModule {}
