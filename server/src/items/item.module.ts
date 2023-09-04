import { Module } from '@nestjs/common'
import { ItemCreater } from './application/item.creater'
import { ItemReader } from './application/item.reader'
import { ItemCreateController } from './web/item-create.controller'
import { ItemDetailController } from './web/item-detail.controller'
import { ItemRepository } from './domain/item.repository'
import { DatabaseModule } from '../config/database/database.module'
import { ItemUpdateController } from './web/item-update.controller'
import { ItemUpdater } from './application/item.updater'

@Module({
  imports: [DatabaseModule],
  controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
  providers: [ItemCreater, ItemRepository, ItemReader, ItemUpdater],
})
export class ItemModule {}
