import { Module } from '@nestjs/common'
import { ItemCreater } from './application/item.creater'
import { ItemReader } from './application/item.reader'
import { ItemCreateController } from './web/item-create.controller'
import { ItemDetailController } from './web/item-detail.controller'
import { ItemRepository } from './domain/item.repository'
import { DatabaseModule } from '../config/database/database.module'
import { ItemUpdateController } from './web/item-update.controller'
import { ItemUpdater } from './application/item.updater'
import { MemberRepository } from '../members/domain/member.repository'
import { JwtProvider } from '../jwt/jwt.provider'
import { ItemImageModule } from '../item-images/item-image.module'

@Module({
  imports: [DatabaseModule, ItemImageModule],
  controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
  providers: [ItemCreater, ItemRepository, ItemReader, ItemUpdater, MemberRepository, JwtProvider],
})
export class ItemModule {}
