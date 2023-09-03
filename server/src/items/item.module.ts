import { Module } from '@nestjs/common'
import { ItemService } from './application/item.service'
import { ItemCreateController } from './web/item-create.controller'
import { ItemDetailController } from './web/item-detail.controller'
import { ItemRepository } from './domain/item.repository'
import { DatabaseModule } from '../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ItemCreateController, ItemDetailController],
  providers: [ItemService, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
