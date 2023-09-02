import { Module } from '@nestjs/common'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'
import { ItemRepository } from './item.repository'
import { DatabaseModule } from '../config/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [ItemController],
  providers: [ItemService, ItemRepository],
  exports: [ItemService],
})
export class ItemModule {}
