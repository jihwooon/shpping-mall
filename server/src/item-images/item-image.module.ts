import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { ItemImageCreater } from '../item-images/application/item-image.creater'
import { ItemImageRepository } from '../item-images/domain/item-image.repository'
import { ItemImageUpdater } from '../item-images/application/item-image.updater'
import { ItemRepository } from '../items/domain/item.repository'
import { MemberModule } from '../members/member.module'
import { JwtModule } from '../jwt/jwt.module'

@Module({
  imports: [DatabaseModule, MemberModule, JwtModule],
  providers: [ItemImageCreater, ItemImageRepository, ItemImageUpdater, ItemRepository],
  exports: [
    ItemImageCreater,
    ItemImageRepository,
    ItemImageUpdater,
    ItemRepository,
    DatabaseModule,
    MemberModule,
    JwtModule,
  ],
})
export class ItemImageModule {}
