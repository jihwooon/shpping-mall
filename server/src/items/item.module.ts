import { Module } from '@nestjs/common'
import { ItemCreater } from './application/item.creater'
import { ItemReader } from './application/item.reader'
import { ItemCreateController } from './web/item-create.controller'
import { ItemDetailController } from './web/item-detail.controller'
import { ItemRepository } from './domain/item.repository'
import { DatabaseModule } from '../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ItemCreateController, ItemDetailController],
  providers: [ItemCreater, ItemRepository, ItemReader],
  exports: [ItemCreater],
})
export class ItemModule {}
