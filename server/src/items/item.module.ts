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
import { ItemImageService } from '../item-images/application/item-image.service'
import { ItemImageRepository } from '../item-images/domain/item-image.repository'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import * as mime from 'mime-types'
import { v4 as uuid } from 'uuid'

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, './uploads')
        },
        filename(req, file, callback) {
          callback(null, `${uuid()}.${mime.extension(file.mimetype)}`)
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
        files: 5,
      },
    }),
  ],
  controllers: [ItemCreateController, ItemDetailController, ItemUpdateController],
  providers: [
    ItemCreater,
    ItemRepository,
    ItemReader,
    ItemUpdater,
    MemberRepository,
    JwtProvider,
    ItemImageService,
    ItemImageRepository,
  ],
})
export class ItemModule {}
