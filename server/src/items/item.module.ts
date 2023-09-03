import { Module } from '@nestjs/common'
import { ItemService } from './application/item.service'
import { ItemController } from './web/item.controller'
import { ItemRepository } from './domain/item.repository'
import { DatabaseModule } from '../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
